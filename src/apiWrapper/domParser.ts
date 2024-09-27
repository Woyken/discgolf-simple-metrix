export const getDomParser = async () => {
  if (typeof window === "object" && "DOMParser" in window)
    return window.DOMParser;
  const { JSDOM } = await import("jsdom");
  return new JSDOM().window.DOMParser;
};
