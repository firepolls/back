'use strict';

import * as jwt from 'jsonwebtoken';
import createError from 'http-errors';
import User from '../model/user';
import { promisify } from '../lib/util';

export const basicAuth = (request, response, next) => {
  let { authorization } = request.headers;

  if(!authorization)
    return next(createError(400, '__AUTH__ No authorization header'));

  let encodedData = authorization.split('Basic ')[1];

  if(!encodedData)
    return next(createError(400, '__AUTH__ basic auth required'));

  let decodedData = new Buffer(encodedData, 'base64').toString();

  let [username, password] = decodedData.split(':');

  if(!username || !password)
    return next(createError(401, '__AUTH__ username or password missing'));

  User.findOne({ username })
    .then(user => {
      if(!user)
        throw createError(401, '__AUTH__ bad username');

      return user.verifyPassword(password);
    })
    .then(user => {
      request.user = user;
      next();
    })
    .catch(next);
};

export const bearerAuth = (request, response, next) => {
  let { authorization } = request.headers;

  if(!authorization)
    return next(createError(400, '__AUTH__ missing auth header'));
  
  let token = authorization.split('Bearer ')[1];
  if(!token)
    return next(createError(400, '__AUTH__ auth must be bearer'));

  promisify(jwt.verify)(token, process.env.SECRET)
    .then(({ tokenSeed }) => User.findOne({ tokenSeed }))
    .then(user => {
      if(!user)
        throw createError(401, '__AUTH__ user not found');
      
      request.user = user;
      next();
    })
    .catch(next);
};
