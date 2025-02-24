import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host:
    process.env.DATABASE_HOST ||
    'dpg-cuuatgfnoe9s73d4gtmg-a.ohio-postgres.render.com',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  user: process.env.DATABASE_USER || 'shopora_db_user',
  password:
    process.env.DATABASE_PASSWORD ||
    'defauzpvMGvzfaQXq6sTwS1zSTfkTetM86oHVltPassword',
  name: process.env.DATABASE_NAME || 'shopora_db',
  synchronize: process.env.DATABASE_SYNC === 'true' ? true : false,
  autoLoadEntities: process.env.DATABASE_AUTOLOAD === 'true' ? true : false,
  ssl: true, // Add this line
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
}));
