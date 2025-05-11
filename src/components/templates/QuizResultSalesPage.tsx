
// Importing necessary components and utilities
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { trackButtonClick } from '@/utils/analytics';
import { getCtaUrl } from '@/services/pixelManager';

// This is a simplified version that should work with the missing trackSaleConversion function
const QuizResultSalesPage: React.FC = () => {
  const handleCheckoutClick = () => {
    // Track the button click
    trackButtonClick('checkout-button', 'Checkout');
    
    // Redirect to checkout
    window.location.href = getCtaUrl();
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Style Results</h1>
      
      <div className="bg-white p-6 shadow-lg rounded-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Primary Style: Classic Elegance</h2>
        <p className="text-gray-700 mb-4">
          You appreciate timeless pieces and gravitate toward sophisticated silhouettes.
          Your wardrobe should consist of well-tailored basics in neutral colors 
          with occasional pops of color through accessories.
        </p>
        
        <div className="my-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium mb-2">Key Recommendations:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Focus on quality over quantity</li>
            <li>Invest in well-tailored blazers and trousers</li>
            <li>Choose a neutral color palette with occasional accent pieces</li>
            <li>Prioritize classic shapes that flatter your body type</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-amber-50 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Unlock Your Full Style Guide</h2>
        <p className="text-center mb-6">
          Get a comprehensive guide with personalized recommendations, 
          color palettes, and a curated shopping list.
        </p>
        
        <div className="text-center">
          <Button 
            onClick={handleCheckoutClick}
            className="py-6 px-8 text-lg bg-emerald-600 hover:bg-emerald-700"
          >
            <ShoppingCart className="mr-2" />
            Get Your Complete Style Guide
          </Button>
          <p className="text-sm mt-3 text-gray-500">
            One-time payment • Secure checkout • Instant access
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizResultSalesPage;
