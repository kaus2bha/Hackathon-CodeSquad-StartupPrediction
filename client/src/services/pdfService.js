import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

class PDFService {
  constructor() {
    this.doc = null;
  }

  // Generate PDF for Premium Analysis Report
  async generatePremiumReport(prediction, elementId = 'premium-report') {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Report element not found');
      }

      // Create canvas from the element
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      this.doc = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      // Add header
      this.addPremiumHeader(prediction);

      // Add the main content
      this.doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        this.doc.addPage();
        this.doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Add footer
      this.addFooter();

      return this.doc;
    } catch (error) {
      console.error('Error generating premium PDF:', error);
      throw error;
    }
  }

  // Generate PDF for Freemium Analysis Report
  async generateFreemiumReport(prediction, elementId = 'freemium-report') {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Report element not found');
      }

      // Create canvas from the element
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      this.doc = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      // Add header
      this.addFreemiumHeader(prediction);

      // Add the main content
      this.doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        this.doc.addPage();
        this.doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Add footer
      this.addFooter();

      return this.doc;
    } catch (error) {
      console.error('Error generating freemium PDF:', error);
      throw error;
    }
  }

  // Add premium report header
  addPremiumHeader(prediction) {
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Premium Startup Analysis Report', 20, 20);
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Startup: ${prediction.startupName || 'N/A'}`, 20, 30);
    this.doc.text(`Industry: ${prediction.industry || 'N/A'}`, 20, 35);
    this.doc.text(`Analysis Date: ${new Date(prediction.createdAt).toLocaleDateString()}`, 20, 40);
    this.doc.text(`Confidence Score: ${prediction.confidence}%`, 20, 45);
    this.doc.text(`Prediction: ${prediction.prediction}`, 20, 50);
    
    // Add a line separator
    this.doc.setLineWidth(0.5);
    this.doc.line(20, 55, 190, 55);
  }

  // Add freemium report header
  addFreemiumHeader(prediction) {
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Startup Prediction Analysis Report', 20, 20);
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Startup: ${prediction.startupName || 'N/A'}`, 20, 30);
    this.doc.text(`Industry: ${prediction.industry || 'N/A'}`, 20, 35);
    this.doc.text(`Analysis Date: ${new Date(prediction.createdAt).toLocaleDateString()}`, 20, 40);
    this.doc.text(`Confidence Score: ${prediction.confidence}%`, 20, 45);
    this.doc.text(`Prediction: ${prediction.prediction}`, 20, 50);
    
    // Add a line separator
    this.doc.setLineWidth(0.5);
    this.doc.line(20, 55, 190, 55);
  }

  // Add footer to all pages
  addFooter() {
    const pageCount = this.doc.internal.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(
        `Generated on ${new Date().toLocaleDateString()} | Page ${i} of ${pageCount}`,
        20,
        285
      );
      this.doc.text(
        'Startup Prediction Platform - AI-Powered Analysis',
        20,
        290
      );
    }
  }

  // Download the PDF
  downloadPDF(filename) {
    if (this.doc) {
      this.doc.save(filename);
    } else {
      throw new Error('No PDF document to download');
    }
  }

  // Generate and download PDF for premium report
  async downloadPremiumReport(prediction, elementId = 'premium-report') {
    try {
      await this.generatePremiumReport(prediction, elementId);
      const filename = `Premium_Analysis_${prediction.startupName?.replace(/\s+/g, '_') || 'Startup'}_${new Date().toISOString().split('T')[0]}.pdf`;
      this.downloadPDF(filename);
      return true;
    } catch (error) {
      console.error('Error downloading premium PDF:', error);
      throw error;
    }
  }

  // Generate and download PDF for freemium report
  async downloadFreemiumReport(prediction, elementId = 'freemium-report') {
    try {
      await this.generateFreemiumReport(prediction, elementId);
      const filename = `Startup_Analysis_${prediction.startupName?.replace(/\s+/g, '_') || 'Startup'}_${new Date().toISOString().split('T')[0]}.pdf`;
      this.downloadPDF(filename);
      return true;
    } catch (error) {
      console.error('Error downloading freemium PDF:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const pdfService = new PDFService();
export default pdfService;
