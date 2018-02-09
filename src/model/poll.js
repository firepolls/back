'use strict';

import createError from 'http-errors';
import Mongoose, { Schema } from 'mongoose';

import Session from './session';
import { log } from '../lib/util';

const pollSchema = new Schema({
  session_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'session',
  },
  question: {
    type: String,
    required: true,
  },
  results: {
    type: Schema.Types.Mixed, 
  },
  pollId: {
    type: Number,
    required: true,
  },
});

const Poll = Mongoose.model('poll', pollSchema);

Poll.create = poll => {
  console.log(poll);
  return new Poll(poll)
    .save();
};

export default Poll;
