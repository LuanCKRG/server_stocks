'use strict';

var f = require('puppeteer');
require('dotenv/config');
var safra_utils = require('../utils/safra_utils');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var f__default = /*#__PURE__*/_interopDefault(f);

const b={index:(r,a)=>a.view("index",{data:void 0}),get:async({body:r},a)=>{const i=r.token;console.log(i);const l=`https://www.safra.com.br/resultado-de-busca.htm?query=analise%20${i}`,n=await f__default.default.launch({headless:!0,executablePath:"/usr/bin/chromium-browser",args:["--no-sandbox","--disable-gpu"]}),e=await n.newPage();try{await e.goto(l,{waitUntil:"load"}),await Promise.all([e.waitForNavigation({waitUntil:"load"}),e.$eval("div.s-col-12.resultados > div:nth-child(1) > a",t=>{console.log(t),t.click();})]);const o=e.url(),{date:c,subtitle:s,title:d}=await Promise.all([e.$eval("h1.titulo",t=>t.textContent??""),e.$eval("h2.sub",t=>t.textContent??""),e.$eval("span.info",t=>t.textContent??"")]).then(t=>({title:t[0],subtitle:t[1],date:t[2]})),u={token:safra_utils.getToken(d),targetPrice:safra_utils.getTargetPrice(s),recomendation:safra_utils.getRecomedation(s),src:"Banco Safra",href:o,date:c};return a.view("index",{data:u})}catch(o){console.error(o);}finally{await e.close(),await n.close();}}};

exports.safra_data = b;
