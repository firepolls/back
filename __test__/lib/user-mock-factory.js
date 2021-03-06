'use strict';

import faker from 'faker';

import User from '../../src/model/user';

export const create = () => {
  let mock = {};
  mock.request = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  return User.create(mock.request)
    .then(user => {
      mock.user = user;
      return user.createToken();
    })
    .then(token => {
      mock.token = token;
      return User.findById(mock.user._id);
    })
    .then(user => {
      mock.user = user;    
      return mock;
    });
};

export const remove = () => User.remove({});
