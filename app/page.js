import Link from "next/link";

export default function HomePage() {
  return (
   <>
<div className="hero bg-base-200 min-h-screen">
  <div className="hero-content text-center">
    <div className="max-w-md">
      <h1 className="text-xxl font-bold text-primary">Kwadwos GPT Genious</h1>
      <p className="py-6 text-lg leading-loose">
        KwadwoGPT: Your AI language companion. Powered by OpenAI, it
        enhances your conversations, content creation, and more.
      </p>
      <Link href="/chat" className="btn btn-secondary">
      GET STARTED
      </Link>
      </div>
  </div>
</div>
   </>
  );
}
