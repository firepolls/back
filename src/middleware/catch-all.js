import createError from 'http-errors';

export default (request, response, next) =>
  next(createError(404, `__ERROR__ ${request.url.path} not found`));
