import { Router } from 'express';
import User from '../model/user';
import { log } from '../lib/util';
import createError from 'http-errors';
import Session from '../model/session';
import { bearerAuth } from './auth-parser';
import { json as bodyParser } from 'express';

export default new Router()
  .post('/session', bearerAuth, bodyParser(), (request, response, next) => {
    log('__ROUTE__ POST/session');
    let sessionObject = null;

    Session.create(request)
      .then(session => {
        sessionObject = session;

        return session.addPolls(request.body.polls);
      })
      .then(polls => {
        const { roomName } = sessionObject;
        const savedRoom = {
          polls,
          roomName,
        };
        return response.json(savedRoom);
      })
      .catch(next);
  })
  .get('/sessions', bearerAuth, (request, response, next) => {
    log('__ROUTE__ GET /sessions');
    User.fetchSessions(request)
      .then(response.json)
      .catch(next);
  })
  .put('/session', bearerAuth, bodyParser(), (request, response, next) => {
    log('__ROUTE__ PUT /session');
    Session.update(request)
      .then(response.json)
      .catch(next);
  })
  .delete('/sessions/:id', bearerAuth, (request, response, next) => {
    log('__ROUTE__ DELETE /sessions/:id');
    Session.delete(request)
      .then(response.sendStatus) 
      .catch(next);
  });
