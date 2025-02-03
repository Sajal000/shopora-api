import * as Joi from '@hapi/joi';

const environmentSchema: Joi.ObjectSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production', 'staging')
    .default('development'),
  DATABASE_PORT: Joi.number().port().default(5433),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_USER: Joi.string().required(),
  PROFILE_API_KEY: Joi.string().required(),
  API_VERSION: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),
  JWT_TOKEN_AUDIENCE: Joi.string().required(),
  JWT_TOKEN_ISSUER: Joi.string().required(),
  JWT_ACCESS_TOKEN_TTL: Joi.number().required(),
  JWT_REFRESH_TOKEN_TTL: Joi.number().required(),

  EMAIL_USER: Joi.string().required(),
  EMAIL_PASS: Joi.string().required(),

  MONGODB_URI: Joi.string().required(),
});

export default environmentSchema;
