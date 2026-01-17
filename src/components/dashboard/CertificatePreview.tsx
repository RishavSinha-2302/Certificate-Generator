'use client';

import { useRef, useEffect } from 'react';
import { useCertiFire } from '@/context/CertiFireContext';

interface CertificatePreviewProps {
  rowIndex: number;
}

export default function CertificatePreview({ rowIndex }: CertificatePreviewProps) {
  const { csvData, selectedTemplate, mappings } = useCertiFire();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !csvData || !selectedTemplate) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const dataRow = csvData.rows[rowIndex];

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = selectedTemplate.url;
    
    image.onload = () => {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      
      mappings.forEach(mapping => {
        const text = dataRow[mapping.csvColumn] || '';
        if (text) {
          ctx.fillStyle = mapping.color;
          ctx.font = `${mapping.fontSize}px "${mapping.fontFamily}"`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          const textX = mapping.x + mapping.width / 2;
          const textY = mapping.y + mapping.height / 2;
          
          ctx.fillText(text, textX, textY, mapping.width);
        }
      });
    };
    
    image.onerror = () => {
        console.error("Failed to load template image for preview.");
    }

  }, [csvData, selectedTemplate, mappings, rowIndex]);

  return <canvas ref={canvasRef} data-row-index={rowIndex} className="w-full h-auto border rounded-lg shadow-md" />;
}
