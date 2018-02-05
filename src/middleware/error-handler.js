import { log } from '../lib/util';

export default (error, request, response, next) => { // eslint-disable-line
  log(error);

  if(error.status)
    return response.sendStatus(error.status);

  const message = error.message.toLowerCase();

  if(message.includes('validation failed'))
    return response.sendStatus(400);
  
  if(message.includes('duplicate key'))
    return response.sendStatus(409);
  
  if(message.includes('objectid failed'))
    return response.sendStatus(404);
  
  if(message.includes('unauthorized') || message.includes('jwt malformed'))
    return response.sendStatus(401);

  response.sendStatus(500);
};
