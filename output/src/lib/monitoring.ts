export const logEvent = (name: string, data?: unknown) => {
    console.log(`[MONITORING] ${name}:`, data || '');
    // Integration point for production monitoring (e.g., Sentry, Datadog)
};

export const measurePerformance = (label: string) => {
    if (typeof window !== 'undefined' && window.performance) {
        const markName = `mark-${label}`;
        window.performance.mark(markName);
        return () => {
            const measureName = `measure-${label}`;
            window.performance.measure(measureName, markName);
            const entries = window.performance.getEntriesByName(measureName);
            const duration = entries[entries.length - 1].duration;
            logEvent('Performance Impact', { label, duration: `${duration.toFixed(2)}ms` });
        };
    }
    return () => { };
};
