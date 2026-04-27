declare module 'hanzi-writer' {
  export interface HanziWriterOptions {
    width?: number;
    height?: number;
    padding?: number;
    showOutline?: boolean;
    strokeAnimationSpeed?: number;
    delayBetweenStrokes?: number;
    strokeColor?: string;
    radicalColor?: string;
    outlineColor?: string;
  }

  export default class HanziWriter {
    static create(element: string | HTMLElement, character: string, options?: HanziWriterOptions): HanziWriter;
    animateCharacter(): void;
    loopCharacterAnimation(): void;
    hideCharacter(): void;
    showCharacter(): void;
    quiz(options?: any): void;
    cancelQuiz(): void;
  }
}
