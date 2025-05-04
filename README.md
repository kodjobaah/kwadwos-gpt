# 🧠 KwadwoGPT — A Playground for Generative AI Workflows

**KwadwoGPT** is a full-stack GenAI app built to explore real-world applications of large language models — from intelligent travel assistants to self-updating knowledge systems. It combines cutting-edge techniques like RAG (Retrieval-Augmented Generation), agentic prompt workflows, persona injection, and LLM-orchestrated web scraping — all in a scalable, modular architecture.

> **Live Demo**: [kwadwos-gpt.vercel.app](https://kwadwos-gpt.vercel.app)  
> **Source Code**: [GitHub Repository](https://github.com/kodjobaah/kwadwos-gpt)

---

## 🌍 1. AI-Powered Tour Planner

This feature allows users to:
- 🔍 Search for real cities and countries
- 📋 Generate structured, one-day family tours using GPT-3.5
- 🧾 Summarize points of interest using prompt templating
- 🖼️ View panoramic images of each location (via OpenAI image generation)
- 💾 Store and search tours using **PostgreSQL + Prisma**

The system validates inputs (e.g. city existence, match with country) and generates structured JSON responses to deliver a clear, consistent tour experience.

---

## 📄 2. LLM-Orchestrated RAG System (Documents & Prompts)

KwadwoGPT supports an advanced RAG workflow that allows users to:
- 📁 Upload documents, which are summarized using an LLM
- 📦 Store embeddings in **AstraDB (Vector DB)**
- 🔍 Perform semantic search using **LLM-generated vector queries**
- 💬 Use a separate LLM to answer the user’s question based on retrieved context

This multi-step flow allows:
- ✨ Intelligent prompt rewriting for precision search
- 🔄 Use of **multi-model pipelines**
- ⚙️ Extendability with fine-tuned LLMs (e.g. via LoRA/QLoRA)

---

## 🌐 3. LLM-Augmented Web Scraper (Experimental)

The app includes a prototype for ingesting **live web data** using LLM + automation:

- 🌍 **Scraping** via Puppeteer + Cheerio to extract content from any site
- 🧼 **Cleaning** using stopword filters to optimize data for summarization/embedding
- 🧠 **(Optional) LLM summarization** to compress page content before storage
- 📦 Designed for embedding into AstraDB for future semantic search

This is the foundation of a self-updating knowledge base — ideal for research agents, internal tooling, or real-time domain learning.

---

## 🎭 4. User-Defined Personas (Coming Soon)

Users will be able to define **custom LLM personas** including:

- 🧑 Role/identity (Legal Advisor, Mentor, Tour Guide, etc.)
- ✍️ Tone and communication style
- 📏 Behavior rules (e.g. avoid jokes, stay concise, cite sources)

These personas will dynamically generate system prompts that shape the model’s responses. The summarizer and tour modules already use static persona logic — this system will make it customizable and reusable.

---

## 🧠 Memory Architecture

KwadwoGPT uses a **hybrid memory model** for intelligent context management:

| Memory Type      | Storage Layer       | Use Case                               |
|------------------|---------------------|----------------------------------------|
| Short-Term       | Session memory      | Live chat context, prompt chaining     |
| Persistent       | PostgreSQL          | Stored chats, tours, user session data |
| Semantic Memory  | AstraDB (Vectors)   | Long-term knowledge + document recall  |

---

## 🛠️ Tech Stack

| Layer              | Technology                                 |
|--------------------|--------------------------------------------|
| Framework          | **Next.js** (App Router, Server Actions)   |
| Frontend UI        | React, TailwindCSS                         |
| Backend Logic      | Server Actions, API Routes                 |
| LLM APIs           | OpenAI, Groq (LLaMA 3), HuggingFace        |
| Vector DB          | AstraDB (Cassandra + Vector Search)        |
| Relational DB      | PostgreSQL + Prisma ORM                    |
| Browser Automation | Puppeteer, Cheerio                         |
| Deployment         | Vercel                                     |

---

## 🔮 Roadmap

- [ ] User persona editor + system prompt builder
- [ ] Tour plan export (PDF/shareable link)
- [ ] Agent-based task routing and tool chaining
- [ ] Voice input for natural query support
- [ ] Document embedding fine-tuning (LoRA/QLoRA-ready)
- [ ] End-to-end ingestion from web to vector storage

---

## 🧾 Project Motivation

This project was built to move beyond theory and actually apply GenAI tools in production-ready workflows. It reflects a deep interest in:

- Prompt engineering & agentic design
- Retrieval pipelines and knowledge graphs
- Multi-modal GenAI applications
- Practical UX for non-technical users

It demonstrates what it takes to ship AI products — not just call APIs.

---

## 🙌 Inspiration

- OpenAI API Docs
- Groq & LLaMA 3 models
- LangChain & AutoGPT concepts
- AstraDB + Vector Search
- Real-world use cases: travel, legal, Q&A, document workflows

---

## 💡 Feedback Welcome

This is an active project.  
Feel free to open an issue, explore the code, or reach out directly if you're curious about the architecture or the ideas behind it.
