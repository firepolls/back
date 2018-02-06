'use strict';

require('./lib/setup');

import faker from 'faker';
import superagent from 'superagent';

import * as server from '../src/lib/server';
import User from '../src/model/user';
import Profile from '../src/model/profile';

import userMockFactory from './lib/user-mock-factory';
import profileMockFactory from './lib/profile-mock-factory';


describe('router-auth', () => {
  beforeAll(server.start);
  afterAll(server.stop);

  describe('POST', () => {
    describe('POST /signup', () => {
      test('creating a user should respond with a 200 status and a token', () => {
        return superagent.post(`${process.env.API_URL}/signup`)
          .send({
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
          })
          .then(response => {
            expect(response.status).toEqual(200);
          });
      });
    });
  });

  describe('GET', () => {
    describe('GET /login', () => {
      test('logging in with valid credentials should respond with a 200 status and a token', () => {
        return userMockFactory.create()
          .then(mock => {
            return superagent.get(`${process.env.API_URL}/login`)
              .auth(mock.request.username, mock.request.password);
          })
          .then(response => {
            expect(response.status).toEqual(200);
          });
      });
    });
  });
});
