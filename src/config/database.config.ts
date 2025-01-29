import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5433'),
  user: process.env.DATABASE_USER || 'defaultUser',
  password: process.env.DATABASE_PASSWORD || 'defaultPassword',
  name: process.env.DATABASE_NAME || 'defaultDatabase',
  synchronize: process.env.DATABASE_SYNC === 'true' ? true : false,
  autoLoadEntities: process.env.DATABASE_AUTOLOAD === 'true' ? true : false,
}));
