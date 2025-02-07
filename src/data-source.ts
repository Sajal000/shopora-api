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
    process.env.NODE_ENV === 'development'
      ? 'src/**/*.entity.ts'
      : 'dist/**/*.entity.js',
  ],
  migrations: [
    process.env.NODE_ENV === 'development'
      ? 'src/migrations/*.ts'
      : 'dist/migrations/*.js',
  ],
  synchronize: process.env.DATABASE_SYNC === 'true',
  logging: process.env.NODE_ENV === 'development',
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
