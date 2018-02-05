'use strict';

require('./lib/setup');

import * as db from '../src/lib/db';
import * as server from '../src/lib/server';

describe('server and db setup', () => {
  describe('db.js', () => {
    test('db should return an error if you try to disconnect when not connected', () => {
      return db.disconnect()
        .then(Promise.reject)
        .catch(error => {
          expect(error.message).toEqual('__ERROR__ Not connected to DB');
        });
    });
  });
  
  describe('server.js', () => {
    test('server should return an error if stopped while already off.', () => {
      return server.stop()
        .then(Promise.reject)
        .catch(error => {
          expect(error.message).toEqual('__ERROR__ Server is already off');
        });
    });
  });  
});

describe('throw away', () => {
  test('db should return an error if you try to connect while already connected', () => {
    return db.connect(true)
      .then(Promise.reject)
      .catch(error => {
        expect(error.message).toEqual('__ERROR__ Already connected to DB');
      });
  });

  test('server should return an error if you start it while it is already started', () => {
    return server.start(true)
      .then(Promise.reject)
      .catch(error => {
        expect(error.message).toEqual('__ERROR__ Server is already on');
      });
  });
});
