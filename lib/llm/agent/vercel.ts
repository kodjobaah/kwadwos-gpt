import { generateText, tool } from "ai";
import { z } from 'zod';
import { groq, invokeLLMSummarization } from '../groq/groq';
import { get_web_data } from '../tools/scrappers/scrapper';
import { GroqResponse } from "@/lib/model/types";
import puppeteer from 'puppeteer'
import cleanup from "../cleanup";
import * as cheerio from 'cheerio';

import { removeStopwords, eng } from 'stopword'
import { openai } from "../openai/openai";

import { pipeline } from '@huggingface/transformers';


export const performRagSearch = async (prompt, system): Promise<GroqResponse> => {
    const { text } = await generateText({
        model: groq('llama-3.3-70b-versatile'),
        prompt: prompt,
        system: system,
        maxSteps: 5,
    });
    return { content: text };
}

function countWords(str) {
    // Split the string by spaces and filter out empty strings
    const wordsArray = str.trim().split(/\s+/).filter(word => word.length > 0);
    return wordsArray.length;
}


export const createVectorSearchParams = async (prompt):  Promise<GroqResponse>  => {

    const system = `
    You are very good at generating search terms for a vector database. 
    Please interpret the prompt and provide the appropriate vector search terms that can be used.
    Can you just include the search terms in the response.
    `;
    const scrapeWebPageLLM = await generateText({
        model: groq('llama-3.1-8b-instant'),
        prompt: prompt,
        system: system,
        experimental_telemetry: {
            isEnabled: true,
            metadata: {
                query: 'vector-search',
                url: prompt,
            },
        },
        maxSteps: 5,
    });

    console.log("response from vectorSearchAgent:", scrapeWebPageLLM)
    return { content: scrapeWebPageLLM.text, usage: { ...scrapeWebPageLLM.usage } };
}


export const scrapeWebPage = async (url): Promise<GroqResponse> => {

    const system = 'You are an AI assistant specialized in processing web content and returning structured JSON data. Always provide your response as valid, well-formatted JSON without any additional text or comments. Focus on extracting and organizing the most relevant information from websites, including main sections, key services or products, and primary navigation links.';

    const prompt = `Please scrape the content of ${url} and provide a structured JSON response of all the titles and links on the page. After scraping, focus on the most important and relevant information.`;

    const scrapeWebPageLLM = await generateText({
        model: groq('llama-3.1-8b-instant'),
        prompt: prompt,
        system: system,
        experimental_telemetry: {
            isEnabled: true,
            metadata: {
                query: 'scrape page',
                url: url,
            },
        },
        tools: {
            query_web_scraper: tool({
                description: 'Scrapes the content of a web page and returns the structured JSON object with titles, articles, and associated links.',
                parameters: z.object({ url: z.string() }),
                execute: async ({ url }) => {
                    const browser = await puppeteer.launch({
                        headless: true,
                        args: ['--no-sandbox', '--disable-setuid-sandbox']
                    });

                    const page = await browser.newPage()

                    await page.goto(url, { waitUntil: 'networkidle0' })

                    await page.evaluate(cleanup);

                    const html = await page.content();

                    // Load the HTML into Cheerio
                    const $ = cheerio.load(html);

                    // Extract all text
                    const allText = $('body').text();
                    // console.log("*************************html-words-before:", allText);
                    // let's load english stopwords
                    const out = removeStopwords([allText], eng)




                   // const res = await invokeLLMSummarization(allText)
                    // console.log("*************************html:", res.text);
                   // console.log("*************************html-words:", countWords(res.usage.totalTokens));

                    return allText;
                },

            }),
        },
        maxSteps: 5,
    });

    console.log('scrape', scrapeWebPageLLM.text);

    return { content: scrapeWebPageLLM.text, usage: { ...scrapeWebPageLLM.usage } };
}