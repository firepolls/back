import { Router } from 'express';
import { log } from '../lib/util';
import createError from 'http-errors';
import Session from '../model/session';
import { bearerAuth } from './auth-parser';
import { json as bodyParser } from 'express';

export default new Router()
  .post('/session', bearerAuth, bodyParser(), (request, response, next) => {
    log('__ROUTE__ POST/session');
    
    Session.create(request)
      // .then(session => {
      //   console.log('from route: ', session);
        
      //   return Promise.all(request.polls
      //     .map(poll => session.addPoll(poll)));
      // })
      .then(response.json)
      .catch(next);
  })
  .get('/session', bearerAuth, (request, response, next) => {
    log('__ROUTE__ GET /session');
    Session.fetchSession(request)
      .then(response.json)
      .catch(next);
  })
  .put('/session', bearerAuth, bodyParser(), (request, response, next) => {
    log('__ROUTE__ PUT /session');
    Session.update(request)
      .then(response.json)
      .catch(next);
  })
  .delete('/session', bearerAuth, (request, response, next) => {
    log('__ROUTE__ DELETE /session');
    Session.delete(request)
      .then(response.sendStatus) 
      .catch(next);
  });
