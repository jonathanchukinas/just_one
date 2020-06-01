import {
  SkippedGuess,
  AcceptedGuess,
  RejectedGuess,
} from './types'


export class Words {

  private currentIndex: number
  private words: string[]

  constructor() {
    this.currentIndex = 0;
    this.words = [
      'match',
      'bat',
      'join',
      'bag',
      'art',
      'edge',
      'water',
      'boy',
      'idea',
      'lift',
      'comfort',
      'toys',
      'silver',
    ];
  }

  get done() {
    const wordCount = this.words.length
    return (this.currentIndex >= wordCount)
  }

  get next() {
    return this.words[this.currentIndex]
  }

  resolve(event: AcceptedGuess | RejectedGuess | SkippedGuess) {
    this.currentIndex += (event.type === 'RejectedGuess' ? 2 : 1)
  }

}
