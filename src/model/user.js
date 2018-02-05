'use strict';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import createError from 'http-errors';
import Mongoose, {Schema} from 'mongoose';

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  tokenSeed: {
    type: String,
    unique: true,
    default: '',
  },
});

userSchema.methods.verifyPassword = function(password) {
  return bcrypt.compare(password, this.passwordHash)
    .then(success => {
      if(!success)
        throw createError(401, '__AUTH__ bad password');
      return this;
    });
};

userSchema.methods.createToken = function() {
  this.tokenSeed = randomBytes(32).toString('base64');
  return this.save()
    .then(() =>
      jwt.sign({tokenSeed: this.tokenSeed}, process.env.SECRET)
    );
};

const User = Mongoose.model('user', userSchema);

User.create = user => {
  if(!user.password || !user.email || ! user.username)
    return Promise.reject(createError(400, '__VALIDATION__ missing username, email, or password'));

  let { password } = user;
  user = Object.assign({}, user, {password: undefined});

  return bcrypt.hash(password, 4)
    .then(passwordHash => {
      user = Object.assign({}, user, { passwordHash });
      return new User(user).save();
    });
};

export default User;
