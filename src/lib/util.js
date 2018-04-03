'use strict';

export const promisify = (fn) => (...args) =>
  new Promise((resolve, reject) =>
    fn(...args, (err, data) => err ? reject(err) : resolve(data)));

export const log = (...args) =>
  process.env.DEBUG === 'true' ? console.log(...args) : undefined;

export const daysToMilliseconds = days => days * 24 * 60 * 60 * 1000;

// Rob - Remove all non-letters/numbers
export const formatRoomName = roomName => roomName.replace(/[\W_]/g, '').toLowerCase();
