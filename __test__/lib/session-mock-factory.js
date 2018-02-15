'use strict';

import faker from 'faker';

import superagent from 'superagent';
import User from '../../src/model/user';
import Poll from '../../src/model/poll';
import Session from '../../src/model/session';
import * as userMockFactory from './user-mock-factory';

export const createWithUser = () => {
  return userMockFactory.create()
    .then((userData) => {      
      return new Session({
        account_id: userData.user.id,
        roomName: faker.random.word(),
        polls: [],
      }).save()
        .then(session => {
          userData.user.sessions = session._id;
          userData.user.save();
          return userData;
        });
    });
};

export const remove = () => {
  Session.remove({});
};

