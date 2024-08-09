import NextLogo from "./NextLogo";
import SupabaseLogo from "./SupabaseLogo";

export default function Header() {
  return (
    <div className='flex flex-col gap-16 items-center'>
      <div className='flex gap-8 justify-center items-center'>
        <h4 className='font-semibold text-3xl'>Chainproof</h4>
      </div>
      <h1 className='sr-only'>Supabase and Next.js Starter Template</h1>
      <p className='text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center'>
        Onchain notarization and verification on Base
      </p>
      <div className='w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8' />
    </div>
  );
}
