'use strict';

var socket = io.connect('http://localhost:3001');
var MAX_LINES = 200;
var state = true;
var backlog = [];

function appendLogLine(logEntry) {
    var logLines = document.getElementById('loglines-base');
    var logLine = logLines.children[0].cloneNode(true);
    var noMatches = document.getElementById('no-matches');

    if (!noMatches.classList.contains('hidden')) {
        noMatches.classList.add('hidden');
    }

    logLine.querySelectorAll('span.line')[0].innerText = logEntry.line;
    logLine.querySelectorAll('span.text')[0].innerText = logEntry.text;
    logLine.classList.add(logEntry.classStr);

    if (logLines.classList.contains('hidden')) {
        logLines.classList.remove('hidden');
    }

    logLine.classList.remove('hidden');
    logLines.appendChild(logLine);
    logLine.scrollIntoView();

    if (logLines.children.length >= MAX_LINES + 1) {
        logLines.removeChild(logLines.children[1]);
    }
    console.log(logLines.children.length);
}

socket.on('line', function (data) {
    if (state) {
        appendLogLine(data);
    } else {
        backlog.push(data);
    }
});

var pauseBtn = document.getElementById('live-pause');
var playBtn = document.getElementById('live-play');

pauseBtn.addEventListener('click', function () {
    if (state) {
        state = false;
    }
});

playBtn.addEventListener('click', function () {
    if (!state) {
        state = true;
    }
    if (backlog.length > 0) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = backlog[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var entry = _step.value;

                appendLogLine(entry);
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
    }
});