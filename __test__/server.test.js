'use strict';

require('./lib/setup');

import mongoose from 'mongoose';

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
  
    test('db should return an error if you try to connect while already connected', () => {
      return db.connect()
        .then(db.connect)
        .then(Promise.reject)
        .catch(error => {
          expect(error.message).toEqual('__ERROR__ Already connected to DB');
        })
        .then(db.disconnect);
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
  
    test('server should return an error if you start it while it is already started', () => {
      return server.start()
        .then(server.start)
        .then(Promise.reject)
        .catch(error => {
          expect(error.message).toEqual('__ERROR__ Server is already on');
        })
        .then(server.stop);
    });
  });  
});
