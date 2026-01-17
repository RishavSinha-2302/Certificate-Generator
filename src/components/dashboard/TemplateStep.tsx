'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { useCertiFire } from '@/context/CertiFireContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Template } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, CheckCircle2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

interface TemplateStepProps {
  onBack: () => void;
  onNext: () => void;
}

const initialTemplates: Template[] = PlaceHolderImages.map((p) => ({
  id: p.id,
  name: p.description,
  url: p.imageUrl,
}));

export default function TemplateStep({ onBack, onNext }: TemplateStepProps) {
  const { selectedTemplate, setSelectedTemplate } = useCertiFire();
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const newTemplate: Template = {
        id: `custom-${Date.now()}`,
        name: file.name,
        url: URL.createObjectURL(file),
      };
      setTemplates((prev) => [newTemplate, ...prev]);
      setSelectedTemplate(newTemplate);
      toast({
        title: 'Template Uploaded',
        description: `${file.name} is ready and selected.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid File',
        description: 'Please upload a valid image file.',
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Step 2: Select a Certificate Template</CardTitle>
          <CardDescription>Choose one of the templates below or upload your own.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button onClick={handleUploadClick} variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Upload Your Own Template
          </Button>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className={cn(
                  'relative rounded-lg border-2 cursor-pointer transition-all duration-300 overflow-hidden group',
                  selectedTemplate?.id === template.id
                    ? 'border-primary ring-4 ring-primary/30'
                    : 'border-transparent hover:border-primary/50'
                )}
                onClick={() => handleSelectTemplate(template)}
              >
                <Image
                  src={template.url}
                  alt={template.name}
                  width={1123}
                  height={794}
                  className="object-cover aspect-[1.41] transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint="certificate"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white text-center p-2 text-sm">{template.name}</p>
                </div>
                {selectedTemplate?.id === template.id && (
                  <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                    <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={onNext} disabled={!selectedTemplate}>
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
