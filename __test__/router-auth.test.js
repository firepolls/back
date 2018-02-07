'use strict';

require('./lib/setup');

import faker from 'faker';
import superagent from 'superagent';

import User from '../src/model/user';

import * as server from '../src/lib/server';
import * as userMockFactory from './lib/user-mock-factory';
import * as profileMockFactory from './lib/profile-mock-factory';


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

      test('creating a user without a required field responds with a 400', () => {
        return superagent.post(`${process.env.API_URL}/signup`)
          .send({
            username: null,
            email: faker.internet.email(),
            password: faker.internet.password(),
          })
          .then(Promise.reject)
          .catch(response => {
            expect(response.status).toEqual(400);
          });
      });

      test('creating a user with an invalid input type responds with a 400', () => {
        return superagent.post(`${process.env.API_URL}/signup`)
          .send({
            username: {},
            email: faker.internet.email(),
            password: faker.internet.password(),
          })
          .then(Promise.reject)
          .catch(response => {
            expect(response.status).toEqual(400);
          });
      });

      test('creating a user without a password responds with a 400', () => {
        return superagent.post(`${process.env.API_URL}/signup`)
          .send({
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: null,
          })
          .then(Promise.reject)
          .catch(response => {
            expect(response.status).toEqual(400);
          });
      });

      test('signing up with a username that is already in use will return a 409', () => {
        let user = null;
        return userMockFactory.create()
          .then(mock => {
            user = mock.user;
            return superagent.post(`${process.env.API_URL}/signup`)
              .send({
                username: user.username,
                email: faker.internet.email(),
                password: faker.internet.password(),
              });
          })
          .then(Promise.reject)
          .catch(response => {
            expect(response.status).toEqual(409);
          });
      });

      test('signing up to an invalid route returns a 404', () => {
        return superagent.post(`${process.env.API_URL}/signupbadroute`)
          .send({
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
          })
          .then(Promise.reject)
          .catch(response => {
            expect(response.status).toEqual(404);
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

      test('logging in without authorization header should return a 400', () => {
        return userMockFactory.create()
          .then(() => {
            return superagent.get(`${process.env.API_URL}/login`);
          })
          .then(Promise.reject)
          .catch(response => {
            expect(response.status).toEqual(400);
          });
      });

      test('logging in with without basic should will return a 400', () => {
        return userMockFactory.create()
          .then(mock => {
            return superagent.get(`${process.env.API_URL}/login`)
              .set('Authorization', 'invalid');
          })
          .then(Promise.reject)
          .catch(response => {
            expect(response.status).toEqual(400);
          });
      });

      test('logging in with a bad username or password should return a 401', () => {
        return userMockFactory.create()
          .then(() => {
            return superagent.get(`${process.env.API_URL}/login`)
              .auth('invalid', 'invalid');
          })
          .then(Promise.reject)
          .catch(response => {
            expect(response.status).toEqual(401);
          });
      });
    });
  });
});
