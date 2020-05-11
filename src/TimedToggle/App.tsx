import React from 'react';
import { useMachine } from '@xstate/react';
import { machine } from './machine';
// import type * as t from './types';
import Child from './Child'


export default function TimedToggle() {

  return <>  
    {/* ['HELLO', 'BYE'].map(name => <Child name={ name } />) */}
    <Child name={ 'BILL' } />
  </>;

}
