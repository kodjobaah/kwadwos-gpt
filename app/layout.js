import localFont from "next/font/local";
import {
  ClerkProvider
} from '@clerk/nextjs'

import "./globals.css";
import Providers from "./providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "KwadwoGPT",
  description: 'KwadwosGTP: Your AI language companion. Powered by OpenAI, it enhances your conversations, content creation and more',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider afterSignOutUrl="/">

      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Providers>
            {children}
          </Providers>

        </body>
      </html>
    </ClerkProvider>
  );
}

