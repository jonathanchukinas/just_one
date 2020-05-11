import React from 'react';
import { useMachine } from '@xstate/react';
import { machine } from './machine';

type MyProps = {
  name: string;
}
export default function Child(props: MyProps) {

  const [state] = useMachine(machine)
  console.log(state)

  return <>
    <br/>
    <br/>
    <br/>
    <p>{ props.name }</p>
    <p>Toggle State: '{ state.value }'</p>
    <p>Done?: '{ state.done ? 'true' : 'false' }'</p>
  </>;

}
