'use strict';

import { Router } from 'express';
import User from '../model/user';
import { basicAuth } from './auth-parser';
import { json as bodyParser } from 'express';
import { log, daysToMilliseconds } from '../lib/util';

export default new Router()
  .post('/signup', bodyParser(), (request, response, next) => {
    log('__ROUTE__ POST /signup');
    new User.create(request.body)
      .then(user => user.createToken())
      .then(token => {
        response.cookie('Socket-Token', token, {maxAge: 900000});
        response.send(token);
      })
      .catch(next);
  })
  .get('/login', basicAuth, (request, response, next) => {
    log('__ROUTE__ GET /login');
    request.user.createToken()
      .then(token => {
        let cookieOptions = {maxAge: daysToMilliseconds(15)};
        response.cookie('Socket-Token', token, cookieOptions);
        response.send(token);
      })
      .catch(next);
  });
  