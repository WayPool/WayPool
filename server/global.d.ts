declare global {
  namespace NodeJS {
    interface Global {
      tvlCache?: {
        [key: string]: {
          tvl: number;
          timestamp: number;
        }
      }
    }
  }
}

export {};