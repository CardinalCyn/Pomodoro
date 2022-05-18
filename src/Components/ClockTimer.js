import React from "react";

const ClockTimer=({displayTime, resetTime, clockCountdown, timeFormat, timerLabelName})=>{
    //shows the name of session or break, shows the formatted time display, button to start the countdown on the clock, and reset button
    return(
        <div>
            <h2 id="timer-label">
                {timerLabelName}
            </h2>
            <h2 id="time-left">
                {timeFormat(displayTime)}
            </h2>
            <button id="start_stop" 
            onClick={()=>clockCountdown()}
            className="btn-large">
                Start/Stop
            </button>
            <button id="reset" 
            onClick={()=>resetTime()}
            className="btn-large">
                Reset
            </button>
        </div>
    )
}

export default ClockTimer