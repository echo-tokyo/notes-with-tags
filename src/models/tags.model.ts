import type { PoolClient } from 'pg'
import { Tag } from '../types.js'

export async function findOrCreateTag(client: PoolClient, name: string): Promise<Tag> {
  const result = await client.query<Tag>(`
    INSERT INTO tags (name)
    VALUES ($1)
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
    RETURNING id, name;
  `, [name])
  return result.rows[0]
}
