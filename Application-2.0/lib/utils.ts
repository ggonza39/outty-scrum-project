/**
 * Robust Array Parser for Postgres {item,item} format and JSON strings.
 * Centralized here to prevent duplication across Dashboard and Inbox.
 */

/* -------------------------------------------------------------------------- */
/* SECTION 1: CORE PARSER LOGIC                                               */
/* -------------------------------------------------------------------------- */
export const getArrayData = (data: any): string[] => {
  // 1.1 Fast-track: Return if already an array
  if (Array.isArray(data)) return data;

  // 1.2 Null-safety check
  if (!data) return [];

  // 1.3 Transformation Logic
  if (typeof data === "string") {
    // Handle Postgres Native Array Strings: {val1,val2}
    if (data.startsWith("{")) {
      return data
        .replace(/[{}]/g, "")
        .split(",")
        .map((s) => s.trim().replace(/^"|"$/g, ""))
        .filter((s) => s !== "");
    }
    // Handle JSON strings: ["val1","val2"]
    if (data.startsWith("[")) {
      try {
        return JSON.parse(data);
      } catch (e) {
        return [];
      }
    }
  }
  return [];
};
