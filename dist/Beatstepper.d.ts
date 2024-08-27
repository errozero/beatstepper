export interface IBeatstepperCallbackData {
    step: number;
    beat: number;
    bar: number;
    startTime: number;
    stepLength: number;
}
export declare class Beatstepper {
    private context;
    private callback;
    private tempoWorker;
    private scheduleAheadTime;
    private lookAhead;
    private nextStepTime;
    private currentStep;
    private currentBeat;
    private currentBar;
    private playing;
    private stepLength;
    private tempo;
    private stepsPerBeat;
    private beatsPerBar;
    constructor(context: AudioContext, callback: Function);
    private setStepLength;
    private scheduler;
    private scheduleStep;
    private nextStep;
    start(): void;
    stop(): void;
    pause(): void;
    getStepsPerBeat(): number;
    setStepsPerBeat(steps: number): void;
    getBeatsPerBar(): number;
    setBeatsPerBar(beats: number): void;
    getTempo(): number;
    setTempo(tempo: number): void;
    getStepLength(): number;
    getScheduleAheadTime(): number;
    /**
     * @param time in seconds
     */
    setScheduleAheadTime(time: number): void;
    getLookAhead(): number;
    /**
     * @param time in milliseconds
     */
    setLookAhead(time: number): void;
    getPlaying(): boolean;
}
