import React from 'react';
import Phase from './Phase';
import Card from './Card';
import {
  CardState, 
} from './types';
import type {
  T_Card,
} from './types';


export default function JustOne() {

  const phases = [
    'Clues',
    'Duplicates',
    'Guessing',
    'Judging',
    'Resolve',
    'End Game',
  ]

  const cards: T_Card[] = [
    { word: 'match', status: CardState.Unplayed },
    { word: 'bat', status: CardState.Unplayed },
    { word: 'join', status: CardState.Unplayed },
    { word: 'bag', status: CardState.Unplayed },
    { word: 'art', status: CardState.Unplayed },
    { word: 'edge', status: CardState.Unplayed },
    { word: 'water', status: CardState.Unplayed },
    { word: 'boy', status: CardState.Unplayed },
    { word: 'idea', status: CardState.Unplayed },
    { word: 'lift', status: CardState.Unplayed },
    { word: 'comfort', status: CardState.Unplayed },
    { word: 'toys', status: CardState.Unplayed },
    { word: 'silver', status: CardState.Unplayed },
  ]
  

  return <div className='bg-pink-200 h-full flex justify-center items-center text-pink-900'>
    <div className='bg-teal-100 rounded p-6 shadow-lg'>
      <h1 className='text-center text-4xl font-bold tracking-widest mb-6'>Just One</h1>
      <div className='flex'>
        <div className=''>
          Turn 1
          {phases.map(phase => <Phase key={ phase } phase={ phase } /> )}
        </div>
        <div className='space-y-3'>
          <p className='font-bold text-center'>
            The Words
          </p>
          {cards.map(card => <Card key={ card.word } card={ card } /> )}
        </div>
      </div>
    </div>
  </div>;

}

