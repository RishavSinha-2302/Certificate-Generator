import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Logo from '@/components/Logo';

export default function WelcomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-lg text-center shadow-2xl">
        <CardHeader className="items-center">
          <Logo className="h-16 w-16" />
          <CardTitle className="text-4xl font-headline mt-4">Welcome to CertiFire</CardTitle>
          <CardDescription className="text-lg pt-2">
            Your one-stop solution for generating beautiful, data-driven certificates with ease.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-muted-foreground">
            Upload your data, pick a template, map your fields, and generate hundreds of personalized certificates in minutes.
          </p>
          <Button asChild size="lg">
            <Link href="/dashboard">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
