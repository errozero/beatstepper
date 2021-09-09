//Based on article: https://html5rocks.com/en/tutorials/audio/scheduling/

import tempoWorker from './worker';

interface IBeatstepperCallbackData {
    step: number,
    beat: number,
    bar: number,
    startTime: number,
    stepLength: number
}

class Beatstepper {
    
    private context: AudioContext;
    private callback: Function;
    
    private tempoWorker: Worker;
    private scheduleAheadTime = 0.18; //How far ahead to schedule events (in seconds)
    private lookAhead = 20.0; //How frequently to call scheduling (in ms)
    private nextStepTime = 0;
    private currentStep = 0;
    private currentBeat = 0;
    private currentBar = 0;
    private playing = false;
    private stepLength = 0.12;
    
    private tempo = 130;
    private stepsPerBeat = 4;
    private beatsPerBar = 4;

    constructor(context: AudioContext, callback: Function){
        this.context = context;
        this.callback = callback;
        this.setStepLength();
        
        this.tempoWorker = tempoWorker;
        this.tempoWorker.postMessage({speed: this.lookAhead});
        this.tempoWorker.onmessage = () => {this.scheduler()};
    }

    private setStepLength(){
        this.stepLength = (60.0 / this.tempo) / this.stepsPerBeat;
    }

    private scheduler(){
        while(this.nextStepTime < this.context.currentTime + this.scheduleAheadTime ) {
            //if(!State.playing) return;
            this.scheduleStep();
            this.nextStep();
        }
    }

    private scheduleStep(){
        let data : IBeatstepperCallbackData = {
            step: this.currentStep,
            beat: this.currentBeat,
            bar: this.currentBar,
            startTime: this.nextStepTime,
            stepLength: this.stepLength
        };

        this.callback(data);
    }

    private nextStep(){
        if(!this.playing) return;

        let maxStep = this.stepsPerBeat * this.beatsPerBar;

        this.nextStepTime += this.stepLength;
        
        this.currentStep++;

        if(this.currentStep == maxStep){
            this.currentStep = 0;
            this.currentBar++;
        }
        
        if(this.currentStep % this.stepsPerBeat == 0){
            this.currentBeat++;

            if(this.currentBeat == this.beatsPerBar){
                this.currentBeat = 0;
            }
        }
    }

    start(){
        this.playing = true;
        this.nextStepTime = this.context.currentTime;
        this.tempoWorker.postMessage({
            message: 'start',
            speed: this.lookAhead,
        });
    }

    stop(){
        this.playing = false;
        this.tempoWorker.postMessage({message: 'stop'});
        this.currentStep = 0;
        this.currentBar = 0;
        this.nextStepTime = 0;
    }

    pause(){
        this.playing = false;
        this.tempoWorker.postMessage({message: 'stop'});
    }

    getStepsPerBeat(){
        return this.stepsPerBeat;
    }

    setStepsPerBeat(steps:number){
        this.stepsPerBeat = steps;
        this.setStepLength();
    }

    getBeatsPerBar(){
        return this.beatsPerBar;
    }

    setBeatsPerBar(beats:number){
        this.beatsPerBar = beats;
        this.setStepLength();
    }

    getTempo(){
        return this.tempo;
    }

    setTempo(tempo:number){
        this.tempo = tempo;
        this.setStepLength();

        //this.tempoWorker.postMessage({speed});
    }

}

export {Beatstepper, IBeatstepperCallbackData};
export default Beatstepper;