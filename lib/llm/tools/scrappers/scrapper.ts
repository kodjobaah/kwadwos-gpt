import pLimit from 'p-limit';
import puppeteer from 'puppeteer';
import { scrapeWebPage } from '../../agent/vercel';
import cleanup from '../../cleanup';

// Token tracking class for GROQ limits
class GroqTokenTracker {
    private tokens: number = 0;
    private lastReset: number = Date.now();
    private readonly tokenLimit: number = 16000;
    private readonly resetInterval: number = 60 * 1000; // 1 minute in ms

    async checkAndAddTokens(tokenCount: number): Promise<void> {
        const now = Date.now();

        // Reset tokens if minute has passed
        if (now - this.lastReset >= this.resetInterval) {
            this.tokens = 0;
            this.lastReset = now;
        }

        // If adding these tokens would exceed limit, wait until next minute
        if (this.tokens + tokenCount > this.tokenLimit) {
            const timeToWait = this.resetInterval - (now - this.lastReset);
            console.log(`GROQ token limit reached (${this.tokens + tokenCount}/${this.tokenLimit}). Waiting ${timeToWait / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, timeToWait));
            this.tokens = tokenCount;
            this.lastReset = Date.now();
        } else {
            this.tokens += tokenCount;
        }

        console.log(`Current GROQ token count: ${this.tokens}/${this.tokenLimit}`);
    }
}

// Rate limiter class to handle request timing
class RateLimiter {
    private tokens: number;
    private lastRefill: number;
    private readonly maxTokens: number;
    private readonly refillRate: number;

    constructor(maxRequestsPerMinute: number) {
        this.maxTokens = maxRequestsPerMinute;
        this.tokens = maxRequestsPerMinute;
        this.lastRefill = Date.now();
        this.refillRate = (60 * 1000) / maxRequestsPerMinute; // milliseconds per token
    }

    async waitForToken(): Promise<void> {
        while (true) {
            this.refillTokens();
            if (this.tokens > 0) {
                this.tokens--;
                return;
            }
            // Wait for approximately one token worth of time
            await new Promise(resolve => setTimeout(resolve, this.refillRate));
        }
    }

    private refillTokens(): void {
        const now = Date.now();
        const timePassed = now - this.lastRefill;
        const newTokens = Math.floor(timePassed / this.refillRate);

        if (newTokens > 0) {
            this.tokens = Math.min(this.maxTokens, this.tokens + newTokens);
            this.lastRefill = now;
        }
    }
}

export const get_web_data = async (startUrl: string, maxDepth = 2) => {
    const scrapedData: Array<{ url: string; data: any }> = [];
    const visitedUrls = new Set<string>();

    // Create rate limiter for 38 requests per minute
    const rateLimiter = new RateLimiter(38);

    // Create GROQ token tracker
    const groqTokenTracker = new GroqTokenTracker();

    // Create concurrent limiter to prevent too many simultaneous connections
    const concurrentLimit = pLimit(5); // Limit to 5 concurrent pages

    const startUrlObj = new URL(startUrl);
    const baseDomain = startUrlObj.hostname;
    const basePath = startUrlObj.pathname.replace(/\/$/, '');

    const isDescendant = (url: string): boolean => {
        const urlObj = new URL(url);
        const urlPath = urlObj.pathname.replace(/\/$/, '');
        if (basePath === "") return true;
        return urlPath.startsWith(basePath);
    };

    const scrapePage = async (url: string, depth: number): Promise<void> => {
        if (depth > maxDepth || visitedUrls.has(url)) return;
        visitedUrls.add(url);

        console.log(`Queuing: ${url} (depth: ${depth})`);

        try {
            // Wait for rate limit token before proceeding
            await rateLimiter.waitForToken();

            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
            const page = await browser.newPage();

            await page.goto(url, { waitUntil: "networkidle0" });
            await page.evaluate(cleanup);


            // Wait for rate limit token before scraping
            await rateLimiter.waitForToken();
            const data = await scrapeWebPage(url);

            // Check GROQ token limit before proceeding with scrapeWebPage
            await groqTokenTracker.checkAndAddTokens(data.usage.totalTokens);

            console.log("data:", JSON.stringify(data));
            scrapedData.push({ url, data });

            let links = await page.$$eval('a', as => as.map(a => a.href));

            links = links.filter((href): href is string => href !== null)
                .filter((href) => !href.includes('cdn') && !href.includes('javascript'))
                .map((href) => new URL(href, startUrl).toString())
                .filter((resolvedHref) => {
                    const urlObj = new URL(resolvedHref);
                    return (
                        urlObj.hostname === baseDomain &&
                        !visitedUrls.has(resolvedHref) &&
                        isDescendant(resolvedHref)
                    );
                });

            await page.close();

            // Queue all links for processing with concurrent limit
            await Promise.all(
                links.map(link =>
                    concurrentLimit(async () => {
                        try {
                            console.log("visiting:", link);
                            await scrapePage(link, depth + 1);
                        } catch (error) {
                            console.error(`Error scraping ${link}:`, error);
                        }
                    })
                )
            );
        } catch (error) {
            console.error(`Error processing ${url}:`, error);
        }
    };

    await scrapePage(startUrl, 0);
    console.log("result:", JSON.stringify(scrapedData, null, 2));
    return scrapedData;
};