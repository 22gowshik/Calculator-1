const reportWebVitals = async (onPerfEntry) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    try {
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');
      
      // Use an array of functions to call them in a loop
      const metrics = [getCLS, getFID, getFCP, getLCP, getTTFB];
      metrics.forEach((metric) => metric(onPerfEntry));
    } catch (error) {
      console.error('Failed to load web-vitals library:', error);
    }
  }
};

export default reportWebVitals;
