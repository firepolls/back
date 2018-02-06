'use strict';

import cors from 'cors';
import { Router } from 'express';
import catchAll from './catch-all';
import authRouter from './router-auth';
import errorHandler from './error-handler';
import profileRouter from './router-profile';
import bindResponseMethods from './bind-response-methods';

export default new Router()
  .use([
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    }),
    bindResponseMethods,
    authRouter,
    profileRouter,
    catchAll,
    errorHandler,
  ]);
