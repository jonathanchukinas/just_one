import React from 'react';
import { useMachine } from '@xstate/react';
import buttonMachine from './Button.machine';


export default function Button(props) {
  
  
  const [state, send] = useMachine(buttonMachine);
  const buttonContext = props.buttonContext;

  const colors = {
    incomplete: 'red',
    complete: 'green'
  }
  const buttonColor = colors[state.value];


  console.log('button machine state', state)

  const buttonSaturation = (
    buttonContext.isSelf ? 
    {bg: 400, text: 900} : {bg: 100, text: 300}
  );
  const cssBgColor = `bg-${buttonColor}-${buttonSaturation.bg}`
  const cssTextColor = `text-${buttonColor}-${buttonSaturation.text}`
  const cssBorder = `border-2 border-${buttonColor}-${buttonSaturation.text}`;
  const cssHoverColor = (buttonContext.isSelf ? `hover:bg-${buttonColor}-500` : "");
  const cssNotSelf = (buttonContext.isSelf ? "" : "cursor-default");
  const buttonCss = `w-56 font-bold py-2 px-4 rounded-full ${cssBgColor} ${cssTextColor} ${cssHoverColor} ${cssBorder} ${cssNotSelf}`
  
  return (<div className="mt-6" >
    <button className={buttonCss} >{buttonContext.playerName}</button>
  </div>);

}
