import React from 'react';
// import {
//   CardState, 
// } from './types';
import type {
  T_Card,
} from './types';




export default function Card(props: { card: T_Card }) {
  
  const { word } = props.card;

  
  return (<div>
    <button className='w-64 bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed shadow-sm'>
      { word.toUpperCase() }
    </button>
  </div>);

}

