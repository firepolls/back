'use strict';

import faker from 'faker';

import Poll from '../../src/model/poll';
import Session from '../../src/model/session';
import * as userMockFactory from './user-mock-factory';

export const create = () => {
  return userMockFactory.create()
    .then(userData => {
      return new Session({
        account_id: userData.user._id,
        name: faker.random.word(),
        bio: faker.random.words(10),
      }).save()
        .then(session => {
          userData.user.session = session._id;
          return userData.user.save()
            .then(() => session);
        })
        .then(session => ({ userData, session }));
    });
};

// ----------------------------------------------
// TODO: REVIEW 
// ----------------------------------------------
// export const createWithPoll = () => {
//   let mock = {};  
//   return create()
//     .then(mockData => {
//       mock = mockData;      
//       const pollRequest = {
//         session_id: mock.session._id,
//         question: faker.hacker.phrase(),
//         results: {
//           1: faker.random.number(),
//           2: faker.random.number(),
//           3: faker.random.number(),
//           4: faker.random.number(),
//         },
//       };
//       return Poll.create(pollRequest);
//     })
//     .then(mock.session.addPoll)
//     .then(session => {
//       mock.session = session;
//       return mock;
//     });
// };

export const remove = () => {
  Session.remove({});
};
