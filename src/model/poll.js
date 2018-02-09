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
});

const Poll = Mongoose.model('poll', pollSchema);

Poll.create = poll => {
  if (!poll) {
    Promise.reject(createError(400, '__ERROR_VALIDATION__ poll is missing question'));
  }

  return new Poll({
    question: poll.question,
    results: poll.results,  
  })
    .markModified('results')
    .save();
};

// TODO: delete poll method


export default Poll;
