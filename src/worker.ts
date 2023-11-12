//Web Worker as a string, removes the need to provide a url to a worker file, this dynamically creates one

const workerCode = `
    let speed = 100;
    let timerID = null;
    onmessage = e => {
        if(e.data.speed) speed = e.data.speed;

        if(e.data.message === 'start'){
            timerID = setInterval(() => {postMessage('pulse')}, speed);
        } 
        else if(e.data.message === 'stop'){
            clearInterval(timerID);
            timerID=null;
        }
    }
`;

const workerBlob = new Blob([workerCode], {type: 'application/javascript'});

export default new Worker(URL.createObjectURL(workerBlob));