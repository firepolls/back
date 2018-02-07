'use strict';

require('./lib/setup');

import faker from 'faker';
import superagent from 'superagent';

import * as server from '../src/lib/server';
import User from '../src/model/user';
import Profile from '../src/model/profile';

import userMockFactory from './lib/user-mock-factory';
import profileMockFactory from './lib/profile-mock-factory';

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
    });
  });
});
