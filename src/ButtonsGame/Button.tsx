import React from 'react';
import { publish } from './pubsub';
import type {
  Channel,
  Event,
  P_PublicState,
} from './types'


// FIXME inline this type?
type Props = { playerState: P_PublicState }

export function Button(props: Props) {
  
  // FIXME deconstruct this above?
  const { playerState } = props;
  const { id, name, isReady } = playerState;

  function toggle() {
    const channel: Channel = { type: "Player", id }
    const event: Event = { type: 'TOGGLE' };
    publish(channel, event);
  }

  const buttonColor = isReady ? 'green' : 'red';


  const buttonSaturation = { bg: 400, text: 900 };
  // {bg: 100, text: 300}
  
  const cssBgColor = `bg-${buttonColor}-${buttonSaturation.bg}`
  const cssTextColor = `text-${buttonColor}-${buttonSaturation.text}`
  const cssBorder = `border-2 border-${buttonColor}-${buttonSaturation.text}`;
  const cssHoverColor = `hover:bg-${buttonColor}-500`;
  const cssNotSelf = ""  // : "cursor-default");
  const buttonCss = `w-56 font-bold py-2 px-4 rounded-full ${cssBgColor} ${cssTextColor} ${cssHoverColor} ${cssBorder} ${cssNotSelf}`
  
  return (<div className="mt-6" >
    <button className={ buttonCss } onClick={ toggle } >{ name }</button>
  </div>);

}
