import { useState } from 'preact/hooks'
import './metronome.css'
import {Beatstepper, IBeatstepperCallbackData} from '../../src/Beatstepper';

const context = new AudioContext();
const tempo = 110;
const stepsPerBeat = 4;

//Metronome
const callback = ({step, beat, bar, startTime, stepLength}:IBeatstepperCallbackData) => {
  const  freq = (step % stepsPerBeat == 0) ? 880 : 440;
	const  oscillator = context.createOscillator();
	oscillator.type = 'square';
	oscillator.frequency.setValueAtTime(freq, context.currentTime); // value in hertz
	oscillator.connect(context.destination);
	oscillator.start(startTime);
	oscillator.stop(startTime + (stepLength/2));

  console.log('Step', step, beat, bar);
}

const bs = new Beatstepper(context, callback);
bs.setStepsPerBeat(stepsPerBeat);
bs.setTempo(tempo);

export function Metronome() {

  const [playing, setPlaying] = useState(false);
  const [tempo, setTempo] = useState(110);

  function start(){
    setPlaying(true);
    bs.start();
  }
  
  function stop(){
    setPlaying(false);
    bs.stop();
  }

  function onTempoChange(tempo:number){
    bs.setTempo(tempo);
    setTempo(tempo);
  }

  return (
    <>
      <div>
        <div style="display: flex;margin-bottom:8px;">
          <input type="range" min="30" max="240" value={tempo} onInput={(e) => onTempoChange(e.target.value) } /> 
          <div>{tempo}</div>
        </div>
      </div>
      <div>
        <button onClick={() => start()}>Start</button>
        <button onClick={() => stop()} style="margin-left:4px;">Stop</button>
      </div>
      <div>
        {playing ? ' PLAYING' : 'STOPPED'}
      </div>
    </>
  )
}
