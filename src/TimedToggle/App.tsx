import React from 'react';
import { useMachine } from '@xstate/react';
import { machine } from './machine';
// import type * as t from './types';


export default function TimedToggle() {

  const [state] = useMachine(machine)

  return <>  
    { state.value }
  </>;

}
