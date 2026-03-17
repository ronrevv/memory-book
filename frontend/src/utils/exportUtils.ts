import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Scrapbook } from '../app/editor/types';

export const exportToJSON = (scrapbook: Scrapbook) => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scrapbook, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", `${scrapbook.title.replace(/\s+/g, '_').toLowerCase()}.json`);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

export const exportToPDF = async (scrapbook: Scrapbook) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  for (let i = 0; i < scrapbook.pages.length; i++) {
    // Target the specific element ID defined in PageCanvas
    const element = document.getElementById('scrapbook-page-content');
    if (!element) {
      console.error('Scrapbook page element not found');
      continue;
    }

    if (i > 0) pdf.addPage();
    
    // Add page number or title if needed
    pdf.setFontSize(8);
    pdf.setTextColor(180);
    pdf.text(`${scrapbook.title} | Page ${i + 1}`, pdfWidth / 2, 8, { align: 'center' });

    try {
      const canvas = await html2canvas(element, {
        useCORS: true,
        scale: 3, // Higher scale for better print quality
        backgroundColor: '#ffffff',
        logging: false,
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      // Calculate dimensions to fit A4 while maintaining 4:5 aspect ratio
      const margin = 20;
      const availableWidth = pdfWidth - (margin * 2);
      const imgWidth = availableWidth;
      const imgHeight = (imgWidth * 5) / 4;
      
      pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);
    } catch (error) {
      console.error('Error generating PDF page:', error);
    }
  }

  pdf.save(`${scrapbook.title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
};
