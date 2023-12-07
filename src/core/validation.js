const Joi = require('joi'); // 👈 1


const JOI_OPTIONS = {
  abortEarly: true,
  allowUnknown: false,
  context: true,
  convert: true,
  presence: 'required',
};


const validate = (schema) => {

  if (!schema) {
    schema = {
      query: {},
      body: {},
      params: {},
    };
  }

  return (ctx, next) => {
    const errors = {}; 

    
    if (!Joi.isSchema(schema.params)) {
      schema.params = Joi.object(schema.params || {});
    }

    
    const { error: paramsError, value: paramsValue } = schema.params.validate(
      ctx.params,
      JOI_OPTIONS 
    );

   
    if (paramsError) {
      errors.params = cleanupJoiError(paramsError);
    } else {
      ctx.params = paramsValue;
    }

   
    if (Object.keys(errors).length) {
      ctx.throw(400, 'Validation failed, check details for more information', {
        code: 'VALIDATION_FAILED',
        details: errors,
      });
    }

    return next(); 
  };
};


const cleanupJoiError = (
    error 
  ) =>
    error.details.reduce((resultObj, { message, path, type }) => { 
      const joinedPath = path.join('.') || 'value'; 
  
      if (!resultObj[joinedPath]) {
        resultObj[joinedPath] = [];
      }
      resultObj[joinedPath].push({
        type,
        message,
      });
  
      return resultObj; 
    }, {});


module.exports = validate; 
