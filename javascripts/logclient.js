const LOG_LINE_CLASS = 'logline';

let pageCurrent = parseInt(document.getElementById('page-current').innerText);
let logFile = document.getElementById('log-file').innerText;

let levelsSelector = document.getElementById('levels');
let startLineInput = document.getElementById('start-line');
let endLineInput = document.getElementById('end-line');
let startDtInput = document.getElementById('start-dt');
let endDtInput = document.getElementById('end-dt');
let pageSizeInput = document.getElementById('page-size');

function getLogEntries(params){
    return new Promise((resolve, reject) => {
        let query = [];
        let startLine = params.startline || '';
        let endLine = params.endline || '';
        let startDt = params.startdt || '';
        let endDt = params.enddt || '';
        let pageSize = parseInt(params.pagesize) || '';
        let level;
        try{
            level = params.level;
        }
        catch(err) {
            level = '';
        }
        query.push('startline=' + startLine);
        query.push('endline=' + endLine);
        query.push('startdt=' + startDt);
        query.push('enddt=' + endDt);
        query.push('level=' + level);
        query.push('pagesize=' + pageSize);
        let formattedQuery = query.join('&');
        let xhr = new XMLHttpRequest();
        let route = '/logs/api/' + params.logFile + '/' + params.pageNum + '?' + formattedQuery;

        xhr.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200) {
                let payload = JSON.parse(this.responseText);
                resolve(payload);
            }
        };
        xhr.open('GET', route);
        xhr.send();
    });
};

function setLogLines(params){
    pageCurrent = parseInt(document.getElementById('page-current').innerText);
    logFile = document.getElementById('log-file').innerText;

    levelsSelector = document.getElementById('levels');
    startLineInput = document.getElementById('start-line');
    endLineInput = document.getElementById('end-line');
    startDtInput = document.getElementById('start-dt');
    endDtInput = document.getElementById('end-dt');
    pageSizeInput = document.getElementById('page-size');



    getLogEntries(params).then((data) => {
        try{
            let toReplace = document.getElementById('loglines-render');
            let logLines = document.getElementById('loglines-base');
            let newLogLines = logLines.cloneNode(true);
            let logLine = newLogLines.querySelectorAll('li')[0].cloneNode(true);

            for(let logEntry of data.logEntries){
                let toAppend = logLine.cloneNode(true);
                toAppend.querySelectorAll('span.line')[0].innerText = logEntry.line;
                toAppend.querySelectorAll('span.text')[0].innerText = logEntry.text;
                toAppend.classList.add(logEntry.classStr);
                toAppend.classList.remove('hidden');
                newLogLines.appendChild(toAppend)
            }
            newLogLines.id = 'loglines-render';
            newLogLines.classList.remove('hidden');
            toReplace.parentNode.replaceChild(newLogLines, toReplace);
        }
        catch(err){
            console.log(err.message);
        }
    });

}

function getParams(){
    return {
        level: levelsSelector.value,
        startline: startLineInput.value,
        endline: endLineInput.value,
        startdt: startDtInput.value,
        enddt: endDtInput.value,
        logFile: logFile,
        pageNum: pageCurrent,
        pagesize: pageSizeInput.value
    }
}



levelsSelector.addEventListener('blur', () => {
    setLogLines(getParams());
});

startLineInput.addEventListener('change', () => {
    setLogLines(getParams());
});

endLineInput.addEventListener('change', () => {
    setLogLines(getParams());
});

startDtInput.addEventListener('change', () => {
    setLogLines(getParams());
});

endDtInput.addEventListener('change', () => {
    setLogLines(getParams());
});

pageSizeInput.addEventListener('change', () => {
    setLogLines(getParams());
});