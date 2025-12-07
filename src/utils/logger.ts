const getTimestamp = (): string => {
return new Date().toISOString();
};

export const logger = {
info: (message: string, obj?: any) => {
console.log(`[${getTimestamp()}] INFO: ${message}`, obj ? obj : '');
},
error: (message: string, error?: any) => {
console.error(`[${getTimestamp()}] ERROR: ${message}`, error ? error : '');
},
warn: (message: string, obj?: any) => {
console.warn(`[${getTimestamp()}] WARN: ${message}`, obj ? obj : '');
}
};