'use strict';

require('./lib/setup');
import faker from 'faker';
import superagent from 'superagent';
import User from '../src/model/user';
import Session from '../src/model/session';
import * as server from '../src/lib/server';
import * as userMockFactory from './lib/user-mock-factory';
import * as sessionMockFactory from './lib/session-mock-factory';

describe('router-session.js', () => {
  beforeAll(server.start);
  afterAll(server.stop);

  describe('POST', () => {
    describe('POST /session', () => {
      test('creating a session should return a 200 status', () => {
        return userMockFactory.create()
          .then(mock => {            
            return superagent.post(`${process.env.API_URL}/session`)
              .set('Authorization', `Bearer ${mock.token}`)
              .send({
                roomName: faker.random.word(),
                polls: [],
              });
          })
          .then(response => {            
            expect(response.status).toEqual(200);
          });
      });

      test('creating a session without roomName parameter will return a 400', () => {
        return userMockFactory.create()
          .then(mock => {
            return superagent.post(`${process.env.API_URL}/session`)
              .set('Authorization', `Bearer ${mock.token}`)
              .send({
                roomName: null,
                polls: [],
              });
          })
          .then(Promise.reject)
          .catch(response => {
            expect(response.status).toEqual(400);
          });
      });

      test('creating a session without authentication header should return a 400', () => {
        return userMockFactory.create()
          .then(mock => {
            return superagent.post(`${process.env.API_URL}/session`)
              .send({
                roomName: faker.random.word(),
                polls: [],
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
    describe('GET /session', () => {
      test('requesting a session that exists with valid credentials will respond with a 200', () => {
        return sessionMockFactory.createWithUser()
          .then((mock) => {                                          
            return superagent.get(`${process.env.API_URL}/sessions`)
              .set('Authorization', `Bearer ${mock.token}`)
              .then(response => {                  
                expect(response.status).toEqual(200);
              });
          });
      });

      test('requesting a session that exists with invalid credentials will respond with a 401', () => {
        return sessionMockFactory.createWithUser()
          .then(mock => {
            return superagent.get(`${process.env.API_URL}/sessions`)
              .set('Authorization', `Bearer invalidToken`)
              .then(Promise.reject)
              .catch(response => {
                expect(response.status).toEqual(401);
              });
          });
      });
    });
  });

  describe('DELETE', () => {
    describe('DELETE /session', () => {
      test('delete existing session should respond with 204 status', () => {
        return sessionMockFactory.createWithUser()
          .then(mock => {                          
            return superagent.delete(`${process.env.API_URL}/sessions/${mock.user.sessions._id}`)
              .set('Authorization', `Bearer ${mock.token}`)
              .then()
              .then(response => {
                expect(response.status).toEqual(204);
              });
          });
      });

      test('should throw status 404 if trying to delete session with invalid credentials', () => {
        return sessionMockFactory.createWithUser()
          .then(mock => {            
            const invalidToken = 'invalidToken';
            return superagent.delete(`${process.env.API_URL}/sessions/:${mock.user.sessions[0]}`)
              .set('Authorization', `Bearer ${invalidToken}`)
              .then(Promise.reject)
              .catch(response => {
                expect(response.status).toEqual(401);
              });
          });
      });
    });
  });
});

