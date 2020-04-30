import React from 'react';

export default function ChatAppMessageList(props) {

  // props has a messages key, which itself is a list of objects with msg key and perhaps a name key.

  var listItemIndex = 0;

  const createListItem = (obj)=>{

    if (obj.hasOwnProperty('name')) {
      return <li key={listItemIndex++} ><strong className="font-bold">{obj.name}:</strong> {obj.msg}</li>
    } else {
      return <li key={listItemIndex++} >{obj.msg}</li>
    }
  }

  return (
    <ul>
      {props.messages.map((message) => 
        createListItem(message)
      )}
    </ul>  
  );

}
