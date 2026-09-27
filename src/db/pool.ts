import { Pool } from 'pg';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Отсутствует обязательная переменная окружения: ${name}`);
  }
  return value;
}

export const pool = new Pool({
  user: requireEnv('POSTGRES_USER'),
  password: requireEnv('POSTGRES_PASSWORD'),
  database: requireEnv('POSTGRES_DB'),
  host: 'localhost',
  port: Number(requireEnv('POSTGRES_PORT')),
});

pool.on('error', (err) => {
  console.error('Неожиданная ошибка простаивающего клиента pg', err);
});