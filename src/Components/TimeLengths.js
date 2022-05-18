import React from "react"

const TimeLengths=({name,displayId, decrementButtonId, incrementButtonId, sessOrBreakTime, breakSessionTimeChange, divLengthName})=>{
  //has header to show break/length name, buttons to decrement the length, length value
    return(
      <div>
        <h1 id={displayId}>{name}</h1>
        <div 
        id="buttonLengthContainer">
          <button 
          id={decrementButtonId}
          onClick={()=>breakSessionTimeChange(name,false)}
          className="btn-large"
          >
          -
          </button>
          <h2 id={divLengthName}>
            {sessOrBreakTime}
          </h2>
          <button 
          id={incrementButtonId}
          onClick={()=>breakSessionTimeChange(name,true)}
          className="btn-large">
          +
          </button>
        </div>
      </div>
    )
  }
  export default TimeLengths