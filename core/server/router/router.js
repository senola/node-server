/**
 * router
 */

const express = require('express');
const router = express.Router();
const home = require('../controller/home');
const puppeteer = require('../controller/puppeteer');

router.get('/home', home);
router.get('/', puppeteer);

module.exports = router;
