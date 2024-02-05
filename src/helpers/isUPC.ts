export const checkUPC = (upc: any) => typeof upc === 'string' && !upc.includes('~');
