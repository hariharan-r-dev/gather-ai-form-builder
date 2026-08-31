export interface AIProvider {
  name: string;
  generateApplication: (prompt: string) => Promise<string>;
}
