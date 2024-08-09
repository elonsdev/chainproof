import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Image from "next/image";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "ChainProof: Secure File Notarization",
  description: "Secure File Notarization Onchain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={GeistSans.className}>
      <body className='bg-background text-foreground'>
        <main className='min-h-screen flex flex-col items-center'>
          <div className='flex-1 w-full flex flex-col gap-20 items-center'>
            <nav className='w-full flex justify-center border-b border-b-foreground/10 h-16'>
              <div className='w-full max-w-4xl flex justify-between items-center p-3 text-sm'>
                <Image
                  alt='Chain Proof Stamp'
                  width={100}
                  height={100}
                  src={"/chainprooflogo.png"}
                />
              </div>
            </nav>
            {children}{" "}
            <footer className='w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs'>
              <p>
                Powered by{" "}
                <a
                  href=''
                  target='_blank'
                  className='font-bold hover:underline'
                  rel='noreferrer'
                >
                  EAS. Built for Superhack 2024 by @elonsdev
                </a>
              </p>
            </footer>
          </div>
        </main>
      </body>
    </html>
  );
}
