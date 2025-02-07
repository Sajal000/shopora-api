import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5433', 10),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password123',
  database: process.env.DATABASE_NAME || 'my-nest-app',
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
