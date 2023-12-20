//Based on article: https://html5rocks.com/en/tutorials/audio/scheduling/
import tempoWorker from './worker';
var Beatstepper = /** @class */ (function () {
    function Beatstepper(context, callback) {
        var _this = this;
        this.scheduleAheadTime = 0.18; //How far ahead to schedule events (in seconds)
        this.lookAhead = 20.0; //How frequently to call scheduling (in ms)
        this.nextStepTime = 0;
        this.currentStep = 0;
        this.currentBeat = 0;
        this.currentBar = 0;
        this.playing = false;
        this.stepLength = 0.12;
        this.tempo = 130;
        this.stepsPerBeat = 4;
        this.beatsPerBar = 4;
        this.context = context;
        this.callback = callback;
        this.setStepLength();
        this.tempoWorker = tempoWorker;
        this.tempoWorker.postMessage({ speed: this.lookAhead });
        this.tempoWorker.onmessage = function () { _this.scheduler(); };
    }
    Beatstepper.prototype.setStepLength = function () {
        this.stepLength = (60.0 / this.tempo) / this.stepsPerBeat;
    };
    Beatstepper.prototype.scheduler = function () {
        while (this.nextStepTime < this.context.currentTime + this.scheduleAheadTime) {
            if (!this.playing)
                return;
            this.scheduleStep();
            this.nextStep();
        }
    };
    Beatstepper.prototype.scheduleStep = function () {
        var data = {
            step: this.currentStep,
            beat: this.currentBeat,
            bar: this.currentBar,
            startTime: this.nextStepTime,
            stepLength: this.stepLength
        };
        this.callback(data);
    };
    Beatstepper.prototype.nextStep = function () {
        if (!this.playing)
            return;
        var maxStep = this.stepsPerBeat * this.beatsPerBar;
        this.nextStepTime += this.stepLength;
        this.currentStep++;
        if (this.currentStep == maxStep) {
            this.currentStep = 0;
            this.currentBar++;
        }
        if (this.currentStep % this.stepsPerBeat == 0) {
            this.currentBeat++;
            if (this.currentBeat == this.beatsPerBar) {
                this.currentBeat = 0;
            }
        }
    };
    Beatstepper.prototype.start = function () {
        if (this.playing) {
            return;
        }
        //Context must not be in paused state, so attempt to resume here
        this.context.resume();
        this.playing = true;
        this.nextStepTime = this.context.currentTime;
        this.tempoWorker.postMessage({
            message: 'start',
            speed: this.lookAhead,
        });
    };
    Beatstepper.prototype.stop = function () {
        if (!this.playing) {
            return;
        }
        this.playing = false;
        this.tempoWorker.postMessage({ message: 'stop' });
        this.currentStep = 0;
        this.currentBar = 0;
        this.nextStepTime = 0;
    };
    Beatstepper.prototype.pause = function () {
        this.playing = false;
        this.tempoWorker.postMessage({ message: 'stop' });
    };
    Beatstepper.prototype.getStepsPerBeat = function () {
        return this.stepsPerBeat;
    };
    Beatstepper.prototype.setStepsPerBeat = function (steps) {
        this.stepsPerBeat = steps;
        this.setStepLength();
    };
    Beatstepper.prototype.getBeatsPerBar = function () {
        return this.beatsPerBar;
    };
    Beatstepper.prototype.setBeatsPerBar = function (beats) {
        this.beatsPerBar = beats;
        this.setStepLength();
    };
    Beatstepper.prototype.getTempo = function () {
        return this.tempo;
    };
    Beatstepper.prototype.setTempo = function (tempo) {
        this.tempo = tempo;
        this.setStepLength();
    };
    Beatstepper.prototype.getStepLength = function () {
        return this.stepLength;
    };
    Beatstepper.prototype.getScheduleAheadTime = function () {
        return this.scheduleAheadTime;
    };
    /**
     * @param time in seconds
     */
    Beatstepper.prototype.setScheduleAheadTime = function (time) {
        this.scheduleAheadTime = time;
    };
    Beatstepper.prototype.getLookAhead = function () {
        return this.lookAhead;
    };
    /**
     * @param time in milliseconds
     */
    Beatstepper.prototype.setLookAhead = function (time) {
        this.lookAhead = time;
    };
    return Beatstepper;
}());
export { Beatstepper };
