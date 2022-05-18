//importing usestate, components, and flushsync for syncronous calls to pass tests
import './App.css';
import React,{useState} from 'react';
import TimeLengths from './Components/TimeLengths';
import ClockTimer from './Components/ClockTimer';
import { flushSync } from 'react-dom';

const App=()=> {
  //session time is the time of session, how long the first state of the timer goes for
  //break time is the time of break, for how long the second state of the timer goes for
  //display time is the time displayed, time until the timer state changes and plays audio cue
  //timeractive is boolean for whether timer is active or not
  //timerlabelname is the label on the timer designating whether it is session time or break time
  const [sessionTime, setSessionTime]=useState(25);
  const [breakTime,setBreakTime]=useState(5);
  const [displayTime, setDisplayTime]=useState(25*60);
  const [timerActive, setTimerActive]=useState(false);
  const [timerLabelName,setTimerLabelName]=useState("Session");
  //starts audio from start, and plays it
  const playBeep=()=>{
    let beepClip=document.getElementById("beep");
    beepClip.currentTime=0;
    beepClip.play();
  }
  //stops audio, rewinds it to start
  const stopBeep=()=>{
    let beepClip=document.getElementById("beep");
    beepClip.pause();
    beepClip.currentTime=0;
  }
  //breaksessiontimechange takes in a type of time, break or session, and increase time, boolean of true or false. allows buttons to determine whether the time should increase or decrease for the session/break lengths. only works if the timer is not turned on. also adjusts display time to match the session time
  const breakSessionTimeChange=(timeType,increaseTime)=>{
    if(!timerActive){
      if(timeType==="Break Length"){
        if(increaseTime&&breakTime<60){
          flushSync(()=>{
            setBreakTime(breakTime+1);
          })
        }
        else if(breakTime>1&&!increaseTime){
          flushSync(()=>{
            setBreakTime(breakTime-1);
          })
        }
      }
      else{
        if(increaseTime &&sessionTime<60){
          flushSync(()=>{
            setSessionTime(sessionTime+1);
            setDisplayTime(displayTime+60);
          })
        }
        else if(sessionTime>1&&!increaseTime){
          flushSync(()=>{
            setSessionTime(sessionTime-1);
            setDisplayTime(displayTime-60)
          })
        }
      }
    }
  }
  //formats the displaytime into a mm:ss format. 
  const timeFormat=(time)=>{
    let minutes=Math.floor(time/60);
    let seconds=(time)%60;
    return((minutes>=10?minutes:"0"+minutes)+":"+(seconds>=10?seconds:"0"+seconds));
  }
  //clockCountdown starts when a button in clocktimer starts it, as well as pauses it when it is clicked again
  const clockCountdown=()=>{
    //timeforcountdown is initially set to display time, and decreases through the interval
    var timeForCountdown=displayTime;
    flushSync(()=>{
      //timeractive is turned opposite of current value
      setTimerActive(!timerActive);
    })
    //variable to see if the state of timer is on break, or is in session. false is not on break, true is on break
    let onBreakCheck=false;
    if(!timerActive){
      //creates countdown, which runs the arrowfunction every second
      const countDown=setInterval(() => {
        //time goes down, and displaytime is set to that time
        timeForCountdown--;
        flushSync(()=>{
          setDisplayTime(timeForCountdown);
        })
        //if the timeforcountdown hits 0, will check if its on break or not, and swap to the opposite, play the sound, change timerlabel, and set the timeforcountdown to the opposite type ie: session->break and keep running
        if(timeForCountdown<=0&&onBreakCheck===true){
          flushSync(()=>{
            playBeep();
            onBreakCheck=false;
            setTimerLabelName("Session");
            timeForCountdown=sessionTime*60+1;
          })
        }
        else if(timeForCountdown<=0&&onBreakCheck===false){
          flushSync(()=>{
            playBeep();
            onBreakCheck=true;
            setTimerLabelName("Break");
            timeForCountdown=breakTime*60+1;

          })
        }
      }, 1000);
      //clears localstorage, and saves the countdown when its paused
      localStorage.clear();
      localStorage.setItem('interval-id',countDown);
    }
    //gets the countdown value
    if(timerActive){
      clearInterval(localStorage.getItem('interval-id'));
    }
  }
  //resets the application to initial state, clears the local storages, stops the audio, 
  const resetTime=()=>{
    flushSync(()=>{
      setSessionTime(25);
      setBreakTime(5);
      setDisplayTime(25*60);
      setTimerActive(false);
      setTimerLabelName("Session");
      stopBeep();
      clearInterval(localStorage.getItem('interval-id'));
    })
  }
  //returns the header, timelengths for the break and session, and the display showing time, start/pause button, and reset button
  return (
    <div id="container">
      <div id="header">
        <h1>Pomodoro Clock</h1>
      </div>
      <div id="timeLengths">
        <TimeLengths 
        name="Break Length" 
        displayId="break-label"
        decrementButtonId="break-decrement"
        incrementButtonId="break-increment"
        sessOrBreakTime={breakTime}
        divLengthName="break-length"
        breakSessionTimeChange={breakSessionTimeChange}
        timeFormat={timeFormat}
       />
        <TimeLengths 
        name="Session Length" 
        displayId="session-label"
        decrementButtonId="session-decrement"
        incrementButtonId="session-increment"
        sessOrBreakTime={sessionTime}
        divLengthName="session-length"
        breakSessionTimeChange={breakSessionTimeChange}
        timeFormat={timeFormat}
        />
        </div>
        <div id="clockTimer">
          <ClockTimer
          displayTime={displayTime}
          resetTime={resetTime}
          clockCountdown={clockCountdown}
          timeFormat={timeFormat}
          playBeep={playBeep}
          stopBeep={stopBeep}
          timerLabelName={timerLabelName}
          />        
        </div>
      <audio id="beep" src="https://drive.google.com/uc?export=download&id=1DUCmYRFzSYfZeaf8mSVmxOcDWwHVBWCE"></audio>
    </div>
  )
}


export default App;
