import React from 'react';
import { useMachine } from '@xstate/react';


export default function Button(props) {
  

  const buttonMachine = props.machine;
  const [state, send] = useMachine(buttonMachine);
  const currentState = state.value;
  const playerName = state.context.playerName;
  const isSelf = state.context.isSelf;
  const handleClick = ()=> {if (isSelf) { send('TOGGLE') }}


  const colors = {
    incomplete: 'red',
    complete: 'green'
  };
  const buttonColor = colors[currentState];


  const buttonSaturation = (
    isSelf ? 
    {bg: 400, text: 900} : {bg: 100, text: 300}
  );
  const cssBgColor = `bg-${buttonColor}-${buttonSaturation.bg}`
  const cssTextColor = `text-${buttonColor}-${buttonSaturation.text}`
  const cssBorder = `border-2 border-${buttonColor}-${buttonSaturation.text}`;
  const cssHoverColor = (isSelf ? `hover:bg-${buttonColor}-500` : "");
  const cssNotSelf = (isSelf ? "" : "cursor-default");
  const buttonCss = `w-56 font-bold py-2 px-4 rounded-full ${cssBgColor} ${cssTextColor} ${cssHoverColor} ${cssBorder} ${cssNotSelf}`
  
  return (<div className="mt-6" >
    <button className={buttonCss} onClick={ handleClick } >{playerName}</button>
  </div>);

}
