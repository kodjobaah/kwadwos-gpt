// app/page.tsx
import FileUploader from '@/components/FileUploader';

export default function Home() {
  return (
    <div className="flex-grow  p-8 ">
      <h1 className="text-3xl font-bold text-center mb-8">
        File Processing System
      </h1>
      <div className='flex-grow'>
      <FileUploader />
      </div>
    </div>
  );
}