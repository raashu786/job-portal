// src/reportWebVitals.ts
const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && performance && performance.getEntriesByName) {
    performance.getEntriesByName('first-contentful-paint').forEach((entry) => {
      onPerfEntry(entry);
    });
  }
};

export default reportWebVitals;