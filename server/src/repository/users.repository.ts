import { QueryResult } from 'pg';
import pool from '../db';

export type UserModel = {
  user_id: number;
  first_name: string;
  last_name: string;
};

export const findById = (id: string): Promise<QueryResult<UserModel>> => {
  return pool.query(
    `SELECT 
      user_id, 
      first_name, 
      last_name 
    FROM users 
    WHERE user_id = $1`,
    [id]
  );
};

export const findByName = (
  firstName: UserModel['first_name'],
  lastName: UserModel['last_name']
): Promise<QueryResult<UserModel>> => {
  return pool.query(
    `
    SELECT user_id 
    FROM users 
    WHERE first_name=$1 AND last_name=$2
    `,
    [firstName, lastName]
  );
};

export const insert = (
  firstName: UserModel['first_name'],
  lastName: UserModel['last_name']
): Promise<QueryResult<UserModel>> => {
  return pool.query(
    `INSERT INTO users (first_name, last_name) VALUES ($1, $2) RETURNING user_id`,
    [firstName, lastName]
  );
};
