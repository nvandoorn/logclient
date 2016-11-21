let socket = io.connect('http://localhost:3001');
const MAX_LINES = 200;
let state = true;
let backlog = [];

function appendLogLine(logEntry){
    let logLines = document.getElementById('loglines-base');
    let logLine = logLines.children[0].cloneNode(true);
    let noMatches = document.getElementById('no-matches');

    if(!noMatches.classList.contains('hidden')){
        noMatches.classList.add('hidden');
    }

    logLine.querySelectorAll('span.line')[0].innerText = logEntry.line;
    logLine.querySelectorAll('span.text')[0].innerText = logEntry.text;
    logLine.classList.add(logEntry.classStr);

    if(logLines.classList.contains('hidden')){
        logLines.classList.remove('hidden');
    }

    logLine.classList.remove('hidden');
    logLines.appendChild(logLine);
    logLine.scrollIntoView();

    if(logLines.children.length >= MAX_LINES + 1){
        logLines.removeChild(logLines.children[1]);
    }
    console.log(logLines.children.length);
}

socket.on('line', function (data) {
    if(state){
        appendLogLine(data);
    }
    else{
        backlog.push(data);
    }
});

let pauseBtn = document.getElementById('live-pause');
let playBtn = document.getElementById('live-play');

pauseBtn.addEventListener('click', () => {
    if(state){
        state = false;
    }
});

playBtn.addEventListener('click', () => {
   if(!state){
       state = true;
   }
   if(backlog.length > 0){
       for(let entry of backlog){
           appendLogLine(entry);
       }
   }
});