import { QueryResult } from 'pg';
import pool from '../db';

type Guests = {
  guest_id: number;
  first_name: string;
  last_name: string;
  table_number: number;
};

export const findAll = (): Promise<QueryResult<Guests[]>> => {
  return pool.query(`
      SELECT
        guest_id,
        first_name,
        last_name,
        table_number
      FROM guests;
    `);
};

export const findByTable = (
  tableNumber: number
): Promise<QueryResult<Guests[]>> => {
  return pool.query(
    `
    SELECT
      guest_id,
      first_name,
      last_name,
      table_number
    FROM guests
    WHERE table_number = $1
  `,
    [tableNumber]
  );
};
