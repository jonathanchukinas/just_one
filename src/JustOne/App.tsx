import React from 'react';
import Phase from './Phase';


export default function JustOne() {

  const phases = [
    'Clues',
    'Duplicates',
    'Guessing',
    'Judging',
    'Resolve'
  ]


  return <ul>
    <p>Just One</p>
    {phases.map(phase => <Phase key={ phase } phase={ phase } /> )}
  </ul>;

}
