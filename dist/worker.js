//Web Worker as a string, removes the need to provide a url to a worker file, this dynamically creates one
var workerCode = "\n    let speed = 100;\n    let timerID = null;\n    onmessage = e => {\n        if(e.data.speed) speed = e.data.speed;\n\n        if(e.data.message === 'start'){\n            timerID = setInterval(() => {postMessage('pulse')}, speed);\n        } \n        else if(e.data.message === 'stop'){\n            clearInterval(timerID);\n            timerID=null;\n        }\n    }\n";
var workerBlob = new Blob([workerCode], { type: 'application/javascript' });
export default new Worker(URL.createObjectURL(workerBlob));
