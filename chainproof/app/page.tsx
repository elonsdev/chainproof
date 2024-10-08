import FileUpload from "@/components/Uploader";

export default async function Index() {
  return (
    <div className='flex-1 flex flex-col gap-20 max-w-4xl px-3'>
      <main className='flex-1 flex flex-col gap-6'>
        <FileUpload />
      </main>
    </div>
  );
}
