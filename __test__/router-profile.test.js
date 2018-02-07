'use strict';

require('./lib/setup');

import faker from 'faker';
import superagent from 'superagent';

import User from '../src/model/user';
import Profile from '../src/model/profile';

import * as server from '../src/lib/server';
import * as userMockFactory from './lib/user-mock-factory';
import * as profileMockFactory from './lib/profile-mock-factory';

describe('router-profile.js', () => {
  beforeAll(server.start);
  afterAll(server.stop);

  describe('POST', () => {
    describe('POST /profile', () => {
      test('creating a profile should return a 200 status', () => {
        return userMockFactory.create()
          .then(mock => {
            return superagent.post(`${process.env.API_URL}/profile`)
              .set('Authorization', `Bearer ${mock.token}`)
              .send({
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
              });
          })
          .then(response => {
            expect(response.status).toEqual(200);
          });
      });

      test('creating a profile without a required parameter will return a 400', () => {
        return userMockFactory.create()
          .then(mock => {
            return superagent.post(`${process.env.API_URL}/profile`)
              .set('Authorization', `Bearer ${mock.token}`)
              .send({
                firstName: faker.name.firstName(),
                lastName: null,
              });
          })
          .then(Promise.reject)
          .catch(response => {
            expect(response.status).toEqual(400);
          });
      });
    });
  });

  describe('GET', () => {
    describe('GET /profile', () => {
      test('should respond with a 200', () => {
        return profileMockFactory.createWithUser()
          .then((mock) => {
            console.log(mock);
            console.log(mock.token);
            return superagent.get(`${process.env.API_URL}/profile`)
              .set('Authorization', `Bearer ${mock.token}`)
              .then(response => {
                expect(response.status).toEqual(200);
              });
          });
      });
    });
  });
});
