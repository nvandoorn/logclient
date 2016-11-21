'use strict';

var LOG_LINE_CLASS = 'logline';

var pageCurrent = parseInt(document.getElementById('page-current').innerText);
var logFile = document.getElementById('log-file').innerText;

var levelsSelector = document.getElementById('levels');
var startLineInput = document.getElementById('start-line');
var endLineInput = document.getElementById('end-line');
var startDtInput = document.getElementById('start-dt');
var endDtInput = document.getElementById('end-dt');
var pageSizeInput = document.getElementById('page-size');

function getLogEntries(params) {
    return new Promise(function (resolve, reject) {
        var query = [];
        var startLine = params.startline || '';
        var endLine = params.endline || '';
        var startDt = params.startdt || '';
        var endDt = params.enddt || '';
        var pageSize = parseInt(params.pagesize) || '';
        var level = void 0;
        try {
            level = params.level;
        } catch (err) {
            level = '';
        }
        query.push('startline=' + startLine);
        query.push('endline=' + endLine);
        query.push('startdt=' + startDt);
        query.push('enddt=' + endDt);
        query.push('level=' + level);
        query.push('pagesize=' + pageSize);
        var formattedQuery = query.join('&');
        var xhr = new XMLHttpRequest();
        var route = '/logs/api/' + params.logFile + '/' + params.pageNum + '?' + formattedQuery;

        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var payload = JSON.parse(this.responseText);
                resolve(payload);
            }
        };
        xhr.open('GET', route);
        xhr.send();
    });
};

function setLogLines(params) {
    pageCurrent = parseInt(document.getElementById('page-current').innerText);
    logFile = document.getElementById('log-file').innerText;

    levelsSelector = document.getElementById('levels');
    startLineInput = document.getElementById('start-line');
    endLineInput = document.getElementById('end-line');
    startDtInput = document.getElementById('start-dt');
    endDtInput = document.getElementById('end-dt');
    pageSizeInput = document.getElementById('page-size');

    getLogEntries(params).then(function (data) {
        try {
            var toReplace = document.getElementById('loglines-render');
            var logLines = document.getElementById('loglines-base');
            var newLogLines = logLines.cloneNode(true);
            var logLine = newLogLines.querySelectorAll('li')[0].cloneNode(true);

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = data.logEntries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var logEntry = _step.value;

                    var toAppend = logLine.cloneNode(true);
                    toAppend.querySelectorAll('span.line')[0].innerText = logEntry.line;
                    toAppend.querySelectorAll('span.text')[0].innerText = logEntry.text;
                    toAppend.classList.add(logEntry.classStr);
                    toAppend.classList.remove('hidden');
                    newLogLines.appendChild(toAppend);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            newLogLines.id = 'loglines-render';
            newLogLines.classList.remove('hidden');
            toReplace.parentNode.replaceChild(newLogLines, toReplace);
        } catch (err) {
            console.log(err.message);
        }
    });
}

function getParams() {
    return {
        level: levelsSelector.value,
        startline: startLineInput.value,
        endline: endLineInput.value,
        startdt: startDtInput.value,
        enddt: endDtInput.value,
        logFile: logFile,
        pageNum: pageCurrent,
        pagesize: pageSizeInput.value
    };
}

levelsSelector.addEventListener('blur', function () {
    setLogLines(getParams());
});

startLineInput.addEventListener('change', function () {
    setLogLines(getParams());
});

endLineInput.addEventListener('change', function () {
    setLogLines(getParams());
});

startDtInput.addEventListener('change', function () {
    setLogLines(getParams());
});

endDtInput.addEventListener('change', function () {
    setLogLines(getParams());
});

pageSizeInput.addEventListener('change', function () {
    setLogLines(getParams());
});