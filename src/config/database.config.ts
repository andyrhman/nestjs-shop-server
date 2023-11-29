import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  autoLoadEntities: false,
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  synchronize: false,
  migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
  migrationsTableName: 'migrations',
}));