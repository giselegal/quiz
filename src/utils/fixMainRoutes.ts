// Function to fix main routes in the application
export const fixMainRoutes = () => {
  // Implementation for fixing routes
  console.log('Fixing main routes...');
  
  // Logic to handle route corrections
  const correctPaths = () => {
    const currentPath = window.location.pathname;
    
    // Handle subdirectory deployments
    if (process.env.BASE_PATH) {
      const basePath = process.env.BASE_PATH;
      
      // Make sure links have correct base path
      document.querySelectorAll('a[href^="/"]').forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith(basePath) && href !== '/') {
          link.setAttribute('href', `${basePath}${href}`);
        }
      });
    }
    
    // Any additional route fixing logic here
  };
  
  // Wait for DOM to be fully loaded
  if (document.readyState === 'complete') {
    correctPaths();
  } else {
    window.addEventListener('load', correctPaths);
  }
};

// Make the function available globally for debugging
if (typeof window !== 'undefined') {
  // Use a type assertion to add the function to the window object
  (window as any).fixMainRoutes = fixMainRoutes;
}

export default fixMainRoutes;

// At the bottom of your file, add:
// Add this to global Window interface
declare global {
  interface Window {
    fixMainRoutes?: () => void;
  }
}
