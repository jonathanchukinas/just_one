import React from 'react';


export default function NavBar(props) {


  return (<>
    <div className="h-10 bg-gray-900">
      {props.buttons.map((button) => 
        <button className="h-10 w-1/6 hover:bg-gray-700 text-gray-500" key={button.text} onClick={()=>{props.setCurrentPage(button.page)}}>{button.text}</button>        
      )};
    </div>
  </>);

}
