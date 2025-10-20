declare global {
  interface Window {
    ethereum?: {
      request: (args: {
        method: string;
        params?: string[];
      }) => Promise<string[]>;
      on: (event: string, callback: (...args: string[]) => void) => void;
      removeListener: (
        event: string,
        callback: (...args: string[]) => void
      ) => void;
    };
  }
}

export {};
