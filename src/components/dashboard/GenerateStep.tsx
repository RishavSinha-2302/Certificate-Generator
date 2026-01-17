'use client';

import { useState } from 'react';
import JSZip from 'jszip';
import { useCertiFire } from '@/context/CertiFireContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import CertificatePreview from './CertificatePreview';
import { ArrowLeft, Download, Mail, RotateCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GenerateStepProps {
  onBack: () => void;
}

export default function GenerateStep({ onBack }: GenerateStepProps) {
  const { csvData } = useCertiFire();
  const [isZipping, setIsZipping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const { toast } = useToast();
  
  const generateAllPreviews = async () => {
    setIsZipping(true);
    toast({
      title: 'Generating Certificates',
      description: 'Please wait while we generate all certificate images...',
    });

    const generatedPreviews: string[] = [];
    const canvases = document.querySelectorAll('canvas[data-row-index]');
    
    canvases.forEach(canvasEl => {
        const canvas = canvasEl as HTMLCanvasElement;
        generatedPreviews.push(canvas.toDataURL('image/png'));
    });
    
    setPreviews(generatedPreviews);
    setIsZipping(false);
    return generatedPreviews;
  }

  const handleDownloadZip = async () => {
    const images = previews.length > 0 ? previews : await generateAllPreviews();
    if(images.length === 0) {
      toast({ variant: 'destructive', title: 'Error', description: 'No certificates to download.'});
      return;
    }

    setIsZipping(true);
    toast({
      title: 'Creating ZIP file',
      description: 'This may take a moment for a large number of certificates.',
    });
    
    const zip = new JSZip();
    images.forEach((dataUrl, index) => {
      const row = csvData?.rows[index];
      const name = row?.name || row?.Name || `certificate-${index + 1}`;
      zip.file(`${name}.png`, dataUrl.split(',')[1], { base64: true });
    });

    zip.generateAsync({ type: 'blob' }).then((content) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'certificates.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      setIsZipping(false);
      toast({
        title: 'Download Ready!',
        description: 'Your ZIP file has been downloaded.',
      });
    });
  };

  const handleEmail = () => {
    setIsSending(true);
    toast({
      title: 'Dispatching Emails',
      description: 'email dispatch process...',
    });
    console.log('--- EMAIL DISPATCH ---');
    csvData?.rows.forEach((row, index) => {
      console.log(`Sending certificate to ${row.email || 'N/A'} for ${row.name || 'N/A'}`);
    });
    console.log('--- DISPATCH COMPLETE ---');

    setTimeout(() => {
      setIsSending(false);
      toast({
        title: 'Emails Sent',
        description: 'Check the mail logs.',
      });
    }, 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Step 4: Generate &amp; Distribute</CardTitle>
          <CardDescription>Preview your certificates and download or "email" them.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="w-full px-12">
            <Carousel>
              <CarouselContent>
                {csvData?.rows.map((row, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <CertificatePreview rowIndex={index} />
                       <p className="text-center text-sm text-muted-foreground mt-2">
                        Certificate {index + 1} of {csvData.rows.length} {row.name && `for ${row.name}`}
                      </p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
             <Button onClick={handleDownloadZip} disabled={isZipping || isSending} size="lg">
              {isZipping ? <RotateCw className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              {isZipping ? 'Zipping...' : 'Download All as ZIP'}
            </Button>
            <Button onClick={handleEmail} disabled={isZipping || isSending} size="lg" variant="secondary">
              {isSending ? <RotateCw className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
              {isSending ? 'Sending...' : 'Dispatch Emails'}
            </Button>
          </div>

          <div className="flex justify-start pt-6">
            <Button onClick={onBack} variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Mapping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
