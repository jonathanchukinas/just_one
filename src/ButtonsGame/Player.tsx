import React, { useState, useEffect } from 'react';
import type { Player } from './player'
import { publish } from './pubsub';
import type {
  Channel,
  Event,
} from './types'


type Props = { player: Player }

export default function Button(props: Props) {
  
  const { player } = props;
  const [playerState, setPlayerState] = useState(player.state);
  const { id, name, isComplete } = playerState;

  useEffect(()=>{
    player.registerObserver(setPlayerState);
  },[])

  function toggle() {
    const channel: Channel = { type: "Player", id }
    const event: Event = { type: 'TOGGLE' };
    publish(channel, event);
  }

  const buttonColor = isComplete ? 'green' : 'red';


  const buttonSaturation = { bg: 400, text: 900 };
  // {bg: 100, text: 300}
  
  const cssBgColor = `bg-${buttonColor}-${buttonSaturation.bg}`
  const cssTextColor = `text-${buttonColor}-${buttonSaturation.text}`
  const cssBorder = `border-2 border-${buttonColor}-${buttonSaturation.text}`;
  const cssHoverColor = `hover:bg-${buttonColor}-500`;
  const cssNotSelf = ""  // : "cursor-default");
  const buttonCss = `w-56 font-bold py-2 px-4 rounded-full ${cssBgColor} ${cssTextColor} ${cssHoverColor} ${cssBorder} ${cssNotSelf}`
  
  return (<div className="mt-6" >
    <button className={buttonCss} onClick={ toggle } >{ name }</button>
  </div>);

}
