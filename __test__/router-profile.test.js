'use strict';

require('./lib/setup');

import faker from 'faker';
import superagent from 'superagent';
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
            console.log(mock.token);
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

      test('creating a profile without authentication header should return a 400', () => {
        return userMockFactory.create()
          .then(mock => {
            return superagent.post(`${process.env.API_URL}/profile`)
              .send({
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
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
      test('requesting a profile that exists with valid credentials will respond with a 200', () => {
        return profileMockFactory.createWithUser()
          .then((mock) => {
            return superagent.get(`${process.env.API_URL}/profile`)
              .set('Authorization', `Bearer ${mock.token}`)
              .then(response => {
                expect(response.status).toEqual(200);
              });
          });
      });

      test('requesting a profile that does not exists with valid credentials will respond with a 404', () => {
        return userMockFactory.create()
          .then((mock) => {
            return superagent.get(`${process.env.API_URL}/profile`)
              .set('Authorization', `Bearer ${mock.token}`)
              .then(Promise.reject)
              .catch(response => {
                expect(response.status).toEqual(404);
              });
          });
      });
    });
  });

  describe('PUT', () => {
    describe('PUT /profile', () => {
      test('updating profile information with valid information will return a 200', () => {
        return profileMockFactory.createWithUser()
          .then((mock) => {
            return superagent.put(`${process.env.API_URL}/profile`)
              .set('Authorization', `Bearer ${mock.token}`)
              .send({
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
              })
              .then(response => {
                expect(response.status).toEqual(200);
              });
          });
      });

      test('updating a profile without a required field will return a 400', () => {
        return profileMockFactory.createWithUser()
          .then((mock) => {
            return superagent.put(`${process.env.API_URL}/profile`)
              .set('Authorization', `Bearer ${mock.token}`)
              .send({
                firstName: faker.name.firstName(),
                lastName: null,
              })
              .then(Promise.reject)
              .catch(response => {
                expect(response.status).toEqual(400);
              });
          });
      });

      test('requesting to update a profile that does not exist will return a 400', () => {
        return userMockFactory.create()
          .then((mock) => {
            return superagent.put(`${process.env.API_URL}/profile`)
              .set('Authorization', `Bearer ${mock.token}`)
              .send({
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
              })
              .then(Promise.reject)
              .catch(response => {
                expect(response.status).toEqual(400);
              });
          });
      });
    });
  });

  describe('DELETE', () => {
    describe('DELETE /profile', () => {
      test('updating a profile without a required field will return a 204', () => {
        return profileMockFactory.createWithUser()
          .then((mock) => {
            return superagent.delete(`${process.env.API_URL}/profile`)
              .set('Authorization', `Bearer ${mock.token}`)
              .then(response => {
                expect(response.status).toEqual(204);
              });
          });
      });
    });
  });
});
