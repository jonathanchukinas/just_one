import React from 'react';
import { useService } from '@xstate/react';


export default function Button({ machine }) {

  const [state, send] = useService(machine);
  const playerName = state.context.playerName;
  // const isSelf = state.context.isSelf;
  // const handleClick = ()=> {if (isSelf) { send('TOGGLE') }}
  const handleClick = ()=> {send('TOGGLE')}

  console.log(playerName, state)


  const colors = {
    pending: 'red',
    complete: 'green'
  };
  const currentState = state.value
  const buttonColor = colors[currentState];


  // const buttonSaturation = (
  //   isSelf ? 
  //   {bg: 400, text: 900} : {bg: 100, text: 300}
  // );
  const buttonSaturation = {bg: 400, text: 900}
  const cssBgColor = `bg-${buttonColor}-${buttonSaturation.bg}`
  const cssTextColor = `text-${buttonColor}-${buttonSaturation.text}`
  const cssBorder = `border-2 border-${buttonColor}-${buttonSaturation.text}`;
  // const cssHoverColor = (isSelf ? `hover:bg-${buttonColor}-500` : "");
  const cssHoverColor = `hover:bg-${buttonColor}-500`;
  const cssNotSelf = "";
  const buttonCss = `w-56 font-bold py-2 px-4 rounded-full ${cssBgColor} ${cssTextColor} ${cssHoverColor} ${cssBorder} ${cssNotSelf}`
  
  return (<div className="mt-6" >
    {/* <p>{playerName}</p> */}
    <button className={buttonCss} onClick={ handleClick } >{playerName}</button>
  </div>);

}
