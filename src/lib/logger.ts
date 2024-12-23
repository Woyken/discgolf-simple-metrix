const logger = {
  log: (...args: unknown[]) => {
    // biome-ignore lint/suspicious/noConsole: Intentional logger wrapper
    // biome-ignore lint/suspicious/noConsoleLog: Intentional logger wrapper
    console.log(...args);
  },
  error: (...args: unknown[]) => {
    // biome-ignore lint/suspicious/noConsole: Intentional logger wrapper
    console.error(...args);
  },
};

export function getLogger() {
  return logger;
}
