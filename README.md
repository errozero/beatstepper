# Beatstepper
This is a webaudio event scheduler inspired by the article:
https://html5rocks.com/en/tutorials/audio/scheduling/

Supports different time divisions: 4/4 or 3/4 for example.

## Usage
Install Beatstepper:
`npm install @errozero/beatstepper`

Create an instance and pass in a web audio context, and a callback function:

```javascript
import  Beatstepper  from  '@errozero/beatstepper';

const ctx = new AudioContext();
const callback = data => {
	console.log('Step!', data);
};

const beatstepper= new Beatstepper(ctx, callback);
```

Now that is setup, call the start method to begin scheduling:
```javascript
beatstepper.start()
```

This will run the default tempo of 130bpm, with 4/4 time division.

Your callback function will run on every step and receive an object with the following structure:
```typescript
{
	step: number, //The current step, starting at 0, default max is 15
	beat: number, //The current beat, starts at 0, default max is 3
	bar: number, //Current bar, starts at 0, default max is 3
	startTime: number, //The webaudio clock time that events for this step should start
	stepLength: number //Calculated length of one step, useful for sub-step timing
}
```


Your callback function could be used to trigger notes or samples from a pattern array etc.

## Methods
**start**\
Starts the clock
```javascript
beatstepper.start();
```
\
**stop**\
Stops the clock and resets the current step, beat and bar to 0
```javascript
beatstepper.stop();
```
\
**pause**\
Pauses the clock
```javascript
beatstepper.pause();
```
\
**setTempo**\
Sets the tempo in bpm

Param: `tempo:number`
```javascript
beatstepper.setTempo(160);
```
  \
**setStepsPerBeat**\
Sets the number of steps that make up a beat, default is 4.
This works together with beatsPerBar to set the timing of the clock.
It represents the first 4 in **4**/4.

Param: `steps:number`
```javascript
beatstepper.setStepsPerBeat(4);
```
\
**setBeatsPerBar**\
Sets the number of beats that make up a bar.
This works together with stepPerBeat to set the timing of the clock.
It represents the second 4 in 4/**4**.

Param: `beats:number`
```javascript
beatstepper.setBeatsPerBar(4);
```
## Metronome example
```javascript
import  Beatstepper  from  '@errozero/beatstepper';

const ctx = new AudioContext();
const stepsPerBeat = 4;
const tempo = 90;

const  callback = data => {
	const  freq = (data.step % stepsPerBeat == 0) ? 880 : 440;
	const  oscillator = context.createOscillator();
	oscillator.type = 'square';
	oscillator.frequency.setValueAtTime(freq, context.currentTime); // value in hertz
	oscillator.connect(context.destination);
	oscillator.start(data.startTime);
	oscillator.stop(data.startTime + (data.stepLength/2));
}

const  beatstepper = new  Beatstepper(context, callback);

beatstepper.setTempo(tempo);
beatstepper.setStepsPerBeat(stepsPerBeat);
```
