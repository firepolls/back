import { Router } from 'express';
import { log } from '../lib/util';
import createError from 'http-errors';
import Profile from '../model/profile';
import { json as bodyParser } from 'express';
import { bearerAuth } from './auth-parser';

export default new Router()
  .post('/profile', bearerAuth, bodyParser(), (request, response, next) => {
    log('__ROUTE__ POST /profile');
    Profile.create(request)
      .then(response.json)
      .catch(next);
  })
  .get('/profile', bearerAuth, (request, response, next) => {
    log('__ROUTE__ GET /profile');
    Profile.fetchProfile(request)
      .then(response.json)
      .catch(next);
  })
  .put('/profile', bearerAuth, bodyParser(), (request, response, next) => {
    log('__ROUTE__ PUT /profile');
    Profile.update(request)
      .then(response.json)
      .catch(next);
  })
  .delete('/profile', bearerAuth, (request, response, next) => {
    log('__ROUTE__ DELETE /profile');
    Profile.delete(request)
      .then(response.sendStatus) 
      .catch(next);
  });
