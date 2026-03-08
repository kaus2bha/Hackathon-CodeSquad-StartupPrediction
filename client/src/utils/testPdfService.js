// Test utility for PDF service
import pdfService from '../services/pdfService';

// Mock prediction data for testing
const mockPrediction = {
  startupName: 'Test Startup',
  industry: 'Technology',
  prediction: 'Success',
  confidence: 85,
  createdAt: new Date().toISOString(),
  fundingAmount: 1000000,
  teamSize: 10,
  revenue: 500000,
  businessModel: 'SaaS'
};

// Test function to verify PDF service
export const testPdfService = async () => {
  try {
    console.log('Testing PDF Service...');
    
    // Test premium report generation
    console.log('Testing Premium Report Generation...');
    const premiumDoc = await pdfService.generatePremiumReport(mockPrediction, 'premium-report');
    console.log('✓ Premium report generated successfully');
    
    // Test freemium report generation
    console.log('Testing Freemium Report Generation...');
    const freemiumDoc = await pdfService.generateFreemiumReport(mockPrediction, 'freemium-report');
    console.log('✓ Freemium report generated successfully');
    
    console.log('✓ All PDF service tests passed!');
    return true;
  } catch (error) {
    console.error('✗ PDF service test failed:', error);
    return false;
  }
};

export default testPdfService;
