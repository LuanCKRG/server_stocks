'use strict';

var app = require('./app');

const s=3e3;app.app.listen({port:s,host:"0.0.0.0"},(t,i)=>{t&&(app.app.log.error(t),process.exit(1)),app.app.log.info(`Fastify is listening on port: ${i}`);});
