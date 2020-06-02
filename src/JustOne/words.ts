import {
  SkipGuess,
  AcceptGuess,
  RejectGuess,
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

  resolve(event: AcceptGuess | RejectGuess | SkipGuess) {
    this.currentIndex += (event.type === 'RejectGuess' ? 2 : 1)
  }

}
