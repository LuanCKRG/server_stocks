'use strict';

var scrape = require('./controllers/scrape');

const e=async t=>{t.get("/",scrape.safra_data.index),t.post("/",scrape.safra_data.get);};

exports.routes = e;
