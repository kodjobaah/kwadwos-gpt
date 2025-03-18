# Kwadwo's GPT

Kwadwo's GPT is an AI-powered chatbot application leveraging **Retrieval-Augmented Generation (RAG)** to enhance responses with external knowledge. The application is built using **Next.js**, **Astra DB**, and **Prisma ORM**, and it is deployed on **Vercel**.

🔗 **Live Demo**: [kwadwos-gpt.vercel.app](https://kwadwos-gpt.vercel.app)

## Features

- **AI Chatbot with RAG**: Uses Astra DB as a vector database for better context-aware responses.
- **Fast & Scalable**: Powered by Next.js with efficient database interactions via Prisma.
- **Modern UI**: Built with Tailwind CSS for a responsive and clean design.
- **Cloud-Hosted**: Deployed seamlessly on Vercel.

## 🚀 Getting Started

To set up and run the project locally, follow these steps:

### **1. Clone the repository**
```bash
git clone https://github.com/kodjobaah/kwadwos-gpt.git
cd kwadwos-gpt
```

### **2. Install dependencies**
```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install

# Using bun
bun install
```

### **3. Configure environment variables**
Create a `.env` file in the root directory and add the necessary environment variables:

```plaintext
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key

# Astra DB connection details
ASTRA_DB_APPLICATION_TOKEN=your_astra_db_token
ASTRA_DB_API_ENDPOINT=your_astra_db_api_endpoint
ASTRA_DB_KEYSPACE=your_keyspace

# Prisma database URL (if applicable)
DATABASE_URL=your_database_url
```

Refer to `.env.example` for more details.

### **4. Run the development server**
```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev

# Using bun
bun dev
```
The application will be accessible at **[http://localhost:3000](http://localhost:3000)**.

---

## 📁 Project Structure

```
kwadwos-gpt/
│── app/             # Next.js App directory
│── components/      # UI components
│── lib/             # Utility functions
│── prisma/          # Prisma ORM schema and database setup
│── public/          # Static assets
│── styles/          # Global and component styles
│── pages/api/       # API routes for backend interactions
│── scripts/         # Scripts for data ingestion, maintenance
└── README.md        # Project documentation
```

---

## ⚙️ Technologies Used

| Technology   | Purpose |
|-------------|---------|
| **Next.js** | React framework for SSR & SSG |
| **Astra DB** | Vector database for RAG-based retrieval |
| **Prisma ORM** | Database schema and query builder |
| **OpenAI API** | AI model integration for chatbot responses |
| **Tailwind CSS** | Modern UI styling |
| **Vercel** | Cloud deployment |

---

## 📡 **How Astra DB is Used for RAG**
The application uses **Astra DB** as a **vector database** to store and retrieve relevant text chunks for **Retrieval-Augmented Generation (RAG)**. Instead of solely relying on OpenAI’s API, the chatbot retrieves **contextually relevant** documents from Astra DB before generating responses.

### **RAG Workflow**
1. **Data Ingestion**: Documents are embedded into vector representations and stored in Astra DB.
2. **Query Execution**: When a user asks a question, the app retrieves similar vectors from Astra DB.
3. **Context Injection**: The retrieved text is combined with the user query.
4. **AI Response Generation**: OpenAI’s GPT model uses the enhanced context to generate an answer.

---

## 🤝 Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add new feature"`
4. Push the changes: `git push origin feature/your-feature`
5. Open a pull request.

---

## 📝 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 🙌 Acknowledgements

- **[OpenAI](https://openai.com/)** for their advanced AI models.
- **[Astra DB](https://www.datastax.com/products/datastax-astra/)** for providing a scalable vector database.
- **[Vercel](https://vercel.com/)** for seamless Next.js hosting.
- **[Prisma](https://www.prisma.io/)** for simplifying database management.

---

🚀 **Enjoy using Kwadwo's GPT!**

