import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  // To change the logo, simply replace the URL in the line below.
  const logoUrl = '/icon.png';

  return (
    <Image
      src={logoUrl}
      alt="CertiFire Logo"
      className={cn('rounded-full', className)}
      data-ai-hint="logo"
    />
  );
}
