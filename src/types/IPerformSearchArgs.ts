export interface IPerformSearchArgs {
  query: string;
  userId: string;
  getClerkToken: () => Promise<string | null>;
  signal: AbortSignal;
}
