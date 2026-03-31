/**
 * Robust Array Parser for Postgres {item,item} format and JSON strings.
 * Centralized here to prevent duplication across Dashboard and Inbox.
 */
export const getArrayData = (data: any): string[] => {
  if (Array.isArray(data)) return data;
  if (!data) return [];

  if (typeof data === 'string') {
    // Handle Postgres Native Array Strings: {val1,val2}
    if (data.startsWith('{')) {
      return data
        .replace(/[{}]/g, '')
        .split(',')
        .map(s => s.trim().replace(/^"|"$/g, ''))
        .filter(s => s !== "");
    }
    // Handle JSON strings: ["val1","val2"]
    if (data.startsWith('[')) {
      try {
        return JSON.parse(data);
      } catch (e) {
        return [];
      }
    }
  }
  return [];
};