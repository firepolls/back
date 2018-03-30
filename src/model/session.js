'use strict';

import createError from 'http-errors';
import Mongoose, { Schema } from 'mongoose';

import Poll from './poll';

const sessionSchema = new Schema({
  account_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  roomName: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  polls: [{
    type: Schema.Types.ObjectId,
    ref: 'poll',
  }],
},
{
  usePushEach: true,
});

// add poll helper function
sessionSchema.methods.addPolls = function (polls) {
  return Promise.all(polls.map(poll => {
    poll.session_id = this._id;
    return Poll.create(poll);
  }))
    .then(pollDocuments => {
      this.polls = pollDocuments.map(poll => poll._id);
      return this.save()
        .then(() => pollDocuments);
    });
};

const Session = Mongoose.model('session', sessionSchema);

// method to create new session
Session.create = request => {
  return new Session({
    account_id: request.user._id,
    roomName: request.body.roomName,
  })
    .save()
    .then(session => {
      request.user.sessions.push(session._id);
      return request.user.save()
        .then(() => session);
    });
};

// fetch a session
Session.fetchSession = request => {
  return Session.findById(request.user.session)
    .then(session => {
      if (!session) {
        return Promise.reject(createError(404, '__ERROR__ session not found'));
      }

      return session;
    });
};

// update session
Session.update = request => {
  let options = { new: true, runValidators: true };
  return Session.findByIdAndUpdate(
    request.user.session,
    request.body,
    options,
  )
    .then(session => {
      if (!session) {
        return Promise.reject(createError(404, '__ERROR__ session not found'));
      }

      return session;
    });
};

// delete session
Session.delete = request => {
  return Session.findByIdAndRemove(request.user.sessions._id)
    .then(() => 204);
};

export default Session;
