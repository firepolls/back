'use strict';

require('./lib/setup');
import faker from 'faker';
import superagent from 'superagent';
import User from '../src/model/user';
import Session from '../src/model/session';
import * as server from '../src/lib/server';
import * as sessionMockFactory from './lib/session-mock-factory';
import * as userMockFactory from './lib/user-mock-factory';


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
                name: faker.random.word(),
                description: faker.random.words(10),
              });
          })
          .then(response => {
            expect(response.status).toEqual(200);
          });
      });
    });
  });
});

