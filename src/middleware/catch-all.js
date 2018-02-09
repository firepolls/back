import createError from 'http-errors';

export default (request, response, next) =>
  request.url === '/' ?
    response.redirect(process.env.CORS_ORIGIN) :
    next(createError(404, `__ERROR__ ${request.url} not found`));
