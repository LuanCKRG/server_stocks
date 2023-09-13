'use strict';

const r=o=>{const t=["neutra","compra","venda","revis\xE3o"];for(const e of t)if(o.toLowerCase().includes(e))return e;return "N\xE3o foi poss\xEDvel obter a recomenda\xE7\xE3o"},n=o=>{for(const t of o.split(" "))if(/[A-ZÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]{4}[0-9]/.test(t))return t.replace(/[:()]/g,"");return "N\xE3o foi poss\xEDvel obter o token"},s=o=>{for(const t of o.split(" "))if(/[R]?[$]?[ ]?(\d{2}\,?\.?)+/.test(t))return t;return "Indeterminado"};

exports.getRecomedation = r;
exports.getTargetPrice = s;
exports.getToken = n;
