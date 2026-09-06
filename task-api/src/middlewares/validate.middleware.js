const { badRequest } = require('../utils/app-error');

function formatZodIssues(issues) {
  return issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message
  }));
}

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!result.success) {
      return next(
        badRequest('请求参数校验失败', 'VALIDATION_ERROR', {
          details: formatZodIssues(result.error.issues)
        })
      );
    }

    req.validated = result.data;
    next();
  };
}

module.exports = validate;
