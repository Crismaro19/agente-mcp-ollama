export class ChunkerService {
  splitText(text: string): string[] {
    return text
      .split('.')
      .map((sentence) => sentence.trim())
      .filter(Boolean)
      .map((sentence) => `${sentence}.`);
  }
}
