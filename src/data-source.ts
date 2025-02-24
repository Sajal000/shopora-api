import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host:
    process.env.DATABASE_HOST ||
    'dpg-cuuatgfnoe9s73d4gtmg-a.ohio-postgres.render.com',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'shopora_db_user',
  password: process.env.DATABASE_PASSWORD || 'zpvMGvzfaQXq6sTwS1zSTfkTetM86oHV',
  database: process.env.DATABASE_NAME || 'shopora_db',
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  entities: [
    __dirname +
      (process.env.NODE_ENV === 'development'
        ? '/../**/*.entity.ts'
        : '/../dist/**/*.entity.js'),
  ],
  migrations: ['./src/migrations/*.{ts,js}'],
  synchronize: process.env.DATABASE_SYNC === 'true' ? true : false,
  logging: process.env.NODE_ENV === 'development',
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
