'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Profile from '../../src/model/profile';
import * as userMockFactory from './user-mock-factory';


export const createWithUser = () => {
  return userMockFactory.create()
    .then(mock => {
      return superagent.post(`${process.env.API_URL}/profile`)
        .set('Authorization', `Bearer ${mock.token}`)
        .send({
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
        })
        .then(() => {
          console.log('mock mock mock', mock);
          return mock;
        });
    });
};

export const remove = () => Profile.remove({});
