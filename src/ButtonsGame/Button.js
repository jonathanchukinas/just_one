import React from 'react';


export default function Button(props) {

  const buttonContext = props.buttonContext;

  function buttonColor() {
    if (buttonContext.isComplete) {
      return "green"
    } else {
      return "red"
    }
  };

  function buttonSaturation() {
    if (buttonContext.isSelf) {
      return {
        bg: 400,
        text: 900
      }
    } else {
        return {
          bg: 100,
          text: 300
        }
    }
  };

  const cssBgColor = `bg-${buttonColor()}-${buttonSaturation().bg}`
  const cssTextColor = `text-${buttonColor()}-${buttonSaturation().text}`
  const cssBorder = `border-2 border-${buttonColor()}-${buttonSaturation().text}`;
  // function cssHoverColor() {
  //   if (buttonContext.isSelf) {
  //     return `hover:bg-${buttonColor()}-500`
  //   } else {
  //     return ""
  //   }
  // };
  const cssNotSelf = (buttonContext.isSelf ? "" : "cursor-default");
  const buttonCss = `w-56 font-bold py-2 px-4 rounded-full ${cssBgColor} ${cssTextColor} ${cssBorder} ${cssNotSelf}`
  

  
  return (<div className="mt-6" >
    <button className={buttonCss} >{buttonContext.playerName}</button>
  </div>);

}
