import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  // To change the logo, simply replace the URL in the line below.
  const logoUrl = 'https://picsum.photos/seed/certifire-logo/128/128';

  return (
    <Image
      src={logoUrl}
      alt="CertiFire Logo"
      width={128}
      height={128}
      className={cn('rounded-full', className)}
      data-ai-hint="logo"
    />
  );
}
