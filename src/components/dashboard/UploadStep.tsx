'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Papa from 'papaparse';
import { useCertiFire } from '@/context/CertiFireContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UploadCloud, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadStepProps {
  onNext: () => void;
}

export default function UploadStep({ onNext }: UploadStepProps) {
  const { csvData, setCsvData } = useCertiFire();
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            toast({
              variant: 'destructive',
              title: 'Parsing Error',
              description: 'Could not parse CSV. Please check the file format. Proceeding with empty data.',
            });
            setCsvData({ headers: [], rows: [] });
          } else {
             const headers = results.meta.fields || [];
             const rows = results.data as Record<string, string>[];
            setCsvData({ headers, rows });
             toast({
              title: 'Success',
              description: `${rows.length} records loaded from ${file.name}.`,
            });
          }
        },
        error: () => {
          toast({
            variant: 'destructive',
            title: 'File Error',
            description: 'An error occurred while reading the file. Proceeding with empty data.',
          });
          setCsvData({ headers: [], rows: [] });
        },
      });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Step 1: Upload Candidate Data</CardTitle>
          <CardDescription>Upload a .csv or .txt file with candidate information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button onClick={handleUploadClick} variant="outline">
              <UploadCloud className="mr-2 h-4 w-4" />
              Choose File
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
            {fileName && <span className="text-sm text-muted-foreground">{fileName}</span>}
          </div>

          {csvData && csvData.rows.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Data Preview</h3>
              <ScrollArea className="h-72 w-full rounded-md border">
                <Table>
                  <TableHeader className="sticky top-0 bg-secondary">
                    <TableRow>
                      {csvData.headers.map((header) => (
                        <TableHead key={header}>{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {csvData.rows.slice(0, 10).map((row, index) => (
                      <TableRow key={index}>
                        {csvData.headers.map((header) => (
                          <TableCell key={header}>{row[header]}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
              {csvData.rows.length > 10 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Showing first 10 of {csvData.rows.length} records.
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={onNext} disabled={!csvData}>
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
