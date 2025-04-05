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

export const findById = (id: string): Promise<QueryResult<Guests>> => {
  return pool.query(
    `
    SELECT
      guest_id,
      first_name,
      last_name,
      table_number
    FROM guests
    WHERE guest_id = $1
  `,
    [id]
  );
};

type GuestsBody = {
  firstName: Guests['first_name'];
  lastName: Guests['last_name'];
  tableNumber: number | null;
};

export const insert = ({
  firstName,
  lastName,
  tableNumber = null,
}: GuestsBody): Promise<QueryResult<Guests>> => {
  return pool.query(
    `
    INSERT INTO guests (first_name, last_name, table_number)
    VALUES ($1, $2, $3)
    RETURNING *
  `,
    [firstName, lastName, tableNumber]
  );
};

export const update = (
  id: string,
  { firstName, lastName, tableNumber = null }: GuestsBody
): Promise<QueryResult<Guests>> => {
  return pool.query(
    `
    UPDATE guests 
    SET
      first_name = $1,
      last_name = $2,
      table_number = $3
    WHERE guest_id = $4
    RETURNING *;
  `,
    [firstName, lastName, tableNumber, id]
  );
};

export const remove = (id: string): Promise<QueryResult<Guests>> => {
  return pool.query(
    `
    DELETE FROM guests
    WHERE guest_id = $1;
  `,
    [id]
  );
};
