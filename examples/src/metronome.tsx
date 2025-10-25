import "./metronome.css";
import { Beatstepper, IBeatstepperCallbackData } from "../../src/Beatstepper";
import { signal } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";

const context = new AudioContext();
const stepsPerBeat = 4;

const currentStep = signal(0);
const playing = signal(false);
const tempo = signal(110);

//Metronome
const callback = ({ step, beat, bar, startTime, stepLength }: IBeatstepperCallbackData) => {
    const freq = step % stepsPerBeat == 0 ? 880 : 440;
    const oscillator = context.createOscillator();
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(freq, context.currentTime); // value in hertz
    oscillator.connect(context.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + stepLength / 2);
    console.log("Step", step, beat, bar);
};

const animationCallback = (data: IBeatstepperCallbackData) => {
    console.log("Animation Callback", data);
    currentStep.value = data.step + 1;
};

const bs = new Beatstepper(context, callback, animationCallback);
bs.setStepsPerBeat(stepsPerBeat);
bs.setTempo(tempo.value);

export function Metronome() {
    function start() {
        currentStep.value = 0;
        playing.value = true;
        bs.start();
    }

    function stop() {
        playing.value = false;
        currentStep.value = 0;
        bs.stop();
    }

    function onTempoChange(e: JSX.TargetedInputEvent<HTMLInputElement>) {
        const newTempo = parseInt(e.currentTarget.value);
        bs.setTempo(newTempo);
        tempo.value = newTempo;
    }

    return (
        <>
            <div style="display: flex;margin-bottom:8px;">
                <input
                    type="range"
                    min="30"
                    max="240"
                    value={tempo}
                    onInput={(e) => onTempoChange(e)}
                />
                <div>{tempo}</div>
            </div>
            <div>
                <button onClick={() => start()}>Start</button>
                <button onClick={() => stop()} style="margin-left:4px;">
                    Stop
                </button>
            </div>
            <div>{playing ? " PLAYING" : "STOPPED"}</div>
            <div>Step: {currentStep}</div>
        </>
    );
}
