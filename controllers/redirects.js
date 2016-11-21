'use strict';

const express = require('express');
const path = require('path');
const router = express.Router();

const folderParser = require('../helpers/folderparser');
const constants = require('../helpers/constants');

router.get('/', (req, res, next) => {
    folderParser.getLogFileNames(constants.logDir).then((folders) => {
        res.redirect(`/logs/view/${folders[0]}/1`);
    });
});

module.exports = router;
