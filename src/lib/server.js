'use strict';

import express from 'express';
import { Server } from 'http';

import * as db from './db';
import { log } from './util';
import socket from './socket';
import middleware from '../middleware';

const app = express().use(middleware);
const state = {
  isOn: false,
  http: null,
};

export const start = () => {
  return new Promise((resolve, reject) => {
    if(state.isOn)
      return reject(new Error('__ERROR__ Server is already on'));

    state.isOn = true;
    db.connect()
      .then(() => {
        const http = Server(app);
        socket(http);

        state.http = http.listen(process.env.PORT, () => {
          log(`__SERVER_UP__ ${process.env.PORT}`);
          resolve();
        });
      })
      .catch(reject);
  });
};

export const stop = () => {
  return new Promise((resolve, reject) => {
    if(!state.isOn)
      return reject(new Error('__ERROR__ Server is already off'));

    return db.disconnect()
      .then(() => {
        state.http.close(() => {
          log('__SERVER_DOWN__');
          state.isOn = false;
          state.http = null;
          resolve();
        });
      })
      .catch(reject);
  });
};
