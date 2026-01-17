'use client';

import Logo from './Logo';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-4 flex items-center">
          <Logo className="h-7" />
          <h1 className="ml-2 font-headline text-xl font-bold">CertiFire</h1>
        </Link>
      </div>
    </header>
  );
}
