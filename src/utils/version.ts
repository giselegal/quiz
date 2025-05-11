
// Version information for the application
export const VERSION = {
  number: "1.0.0",
  buildNumber: "2023.05.11",
  buildDate: "2023-05-11",
  environment: process.env.NODE_ENV || "development",
  lastUpdated: "2023-05-11T00:00:00Z", // Adding the missing lastUpdated property
};

// Display version info in the console
export const displayVersion = () => {
  console.log(`App Version: ${VERSION.number} (Build ${VERSION.buildNumber})`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
};

// Get detailed version information
export const getVersionInfo = () => {
  return {
    version: VERSION.number,
    build: VERSION.buildNumber,
    date: VERSION.buildDate,
    environment: VERSION.environment,
    lastUpdated: VERSION.lastUpdated,
    userAgent: navigator.userAgent,
    platform: navigator.platform
  };
};

export default VERSION;
