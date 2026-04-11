'use client';

import React, { useState } from 'react';
import { FileImage, FileText } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

interface ExportOptionsProps {
  elementRef: React.RefObject<HTMLDivElement | null>;
  title: string;
}

export const ExportOptions = ({ elementRef, title }: ExportOptionsProps) => {
  const [exporting, setExporting] = useState(false);

  const handleExportPNG = async () => {
    if (!elementRef.current) return;
    setExporting(true);
    const toastId = toast.loading('Génération de l\'image...');
    
    try {
      // Small delay to ensure UI is stable
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const dataUrl = await htmlToImage.toPng(elementRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#f8fafc',
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
      
      toast.success('Image exportée !', { id: toastId });
    } catch (error) {
      console.error('PNG Export Error:', error);
      toast.error('Erreur lors de l\'export image. Réessayez.', { id: toastId });
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    if (!elementRef.current) return;
    setExporting(true);
    const toastId = toast.loading('Génération du PDF...');

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use toJpeg for PDF to save space and potentially avoid transparency issues
      const dataUrl = await htmlToImage.toJpeg(elementRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#f8fafc',
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // We need dimensions to calculate ratio
      // Created a temporary image to get dimensions
      const img = new Image();
      img.src = dataUrl;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const imgWidth = img.width;
      const imgHeight = img.height;
      const ratio = Math.min(pdfWidth / imgWidth, (pdfHeight - 20) / imgHeight);
      
      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;
      
      const xIndex = (pdfWidth - finalWidth) / 2;
      const yIndex = 10; // Top margin

      pdf.addImage(dataUrl, 'JPEG', xIndex, yIndex, finalWidth, finalHeight);
      pdf.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().getTime()}.pdf`);
      
      toast.success('PDF exporté !', { id: toastId });
    } catch (error) {
      console.error('PDF Export Error:', error);
      toast.error('Erreur lors de l\'export PDF. Essayez l\'export image.', { id: toastId });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={handleExportPNG}
        disabled={exporting}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all active:scale-95 disabled:opacity-50"
      >
        <FileImage className="w-4 h-4" />
        {exporting ? 'Export...' : 'Export PNG'}
      </button>
      <button
        onClick={handleExportPDF}
        disabled={exporting}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-red-600 transition-all active:scale-95 disabled:opacity-50"
      >
        <FileText className="w-4 h-4" />
        {exporting ? 'Export...' : 'Export PDF'}
      </button>
    </div>
  );
};
