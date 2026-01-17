'use client';

import { useState, useRef, useEffect } from 'react';
import { useCertiFire } from '@/context/CertiFireContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, ArrowLeft, ArrowRight, MousePointer2 } from 'lucide-react';
import type { Mapping } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface MappingStepProps {
  onBack: () => void;
  onNext: () => void;
}

export default function MappingStep({ onBack, onNext }: MappingStepProps) {
  const { csvData, selectedTemplate, mappings, setMappings } = useCertiFire();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentRect, setCurrentRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const { toast } = useToast();

  const draw = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    ctx.font = `16px "PT Sans"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    mappings.forEach((mapping) => {
      ctx.strokeStyle = '#7E57C2';
      ctx.lineWidth = 2;
      ctx.strokeRect(mapping.x, mapping.y, mapping.width, mapping.height);

      ctx.fillStyle = 'rgba(126, 87, 194, 0.2)';
      ctx.fillRect(mapping.x, mapping.y, mapping.width, mapping.height);
      
      ctx.fillStyle = '#7E57C2';
      ctx.fillText(mapping.csvColumn || 'Unassigned', mapping.x + mapping.width / 2, mapping.y + mapping.height / 2);
    });

    if (isDrawing && currentRect) {
      ctx.strokeStyle = '#3F51B5';
      ctx.lineWidth = 2;
      ctx.strokeRect(currentRect.x, currentRect.y, currentRect.w, currentRect.h);
    }
  };

  useEffect(() => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = selectedTemplate?.url || '';
    imageRef.current = image;
    
    image.onload = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        draw();
      }
    };
  }, [selectedTemplate]);

  useEffect(draw, [mappings, isDrawing, currentRect]);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const coords = getCanvasCoordinates(e);
    setStartPoint(coords);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint) return;
    const coords = getCanvasCoordinates(e);
    setCurrentRect({
      x: Math.min(startPoint.x, coords.x),
      y: Math.min(startPoint.y, coords.y),
      w: Math.abs(coords.x - startPoint.x),
      h: Math.abs(coords.y - startPoint.y),
    });
  };

  const handleMouseUp = () => {
    if (isDrawing && currentRect && currentRect.w > 5 && currentRect.h > 5) {
      const newMapping: Mapping = {
        id: `map-${Date.now()}`,
        csvColumn: '',
        x: currentRect.x,
        y: currentRect.y,
        width: currentRect.w,
        height: currentRect.h,
        fontSize: 24,
        color: '#000000',
      };
      setMappings([...mappings, newMapping]);
    }
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentRect(null);
  };

  const updateMapping = (id: string, newProps: Partial<Mapping>) => {
    setMappings(mappings.map((m) => (m.id === id ? { ...m, ...newProps } : m)));
  };

  const deleteMapping = (id: string) => {
    setMappings(mappings.filter((m) => m.id !== id));
  };
  
  const handleSave = () => {
    if(mappings.some(m => !m.csvColumn)){
        toast({
            variant: 'destructive',
            title: 'Unassigned Fields',
            description: 'Please assign a CSV column to all mapped fields.',
        });
        return;
    }
    onNext();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      <Card className="lg:col-span-2 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Step 3: Map Data Fields</CardTitle>
          <CardDescription>Draw rectangles on the template to map data fields.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 rounded-md bg-secondary mb-4">
            <MousePointer2 className="h-4 w-4" />
            <span>Click and drag on the certificate to create a new field.</span>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="cursor-crosshair w-full h-auto"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Mapped Fields</CardTitle>
          <CardDescription>Adjust and assign CSV columns to your fields.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mappings.map((mapping, index) => (
            <div key={mapping.id} className="p-3 border rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <p className="font-semibold">Field {index + 1}</p>
                <Button variant="ghost" size="icon" onClick={() => deleteMapping(mapping.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <Select
                value={mapping.csvColumn}
                onValueChange={(value) => updateMapping(mapping.id, { csvColumn: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select CSV Column" />
                </SelectTrigger>
                <SelectContent>
                  {csvData?.headers.map((header) => (
                    <SelectItem key={header} value={header}>
                      {header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
               <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor={`fs-${mapping.id}`} className="text-xs">Font Size</Label>
                  <Input id={`fs-${mapping.id}`} type="number" value={mapping.fontSize} onChange={e => updateMapping(mapping.id, {fontSize: parseInt(e.target.value, 10)})} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`c-${mapping.id}`} className="text-xs">Color</Label>
                  <Input id={`c-${mapping.id}`} type="color" value={mapping.color} onChange={e => updateMapping(mapping.id, {color: e.target.value})} />
                </div>
              </div>
            </div>
          ))}
          {mappings.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No fields mapped yet.</p>}
          
          <div className="flex justify-between pt-4">
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleSave} disabled={mappings.length === 0}>
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
