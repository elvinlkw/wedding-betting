import { Request, Response } from 'express';
import { guestsRepository } from '../repository';
import camelcaseKeys from 'camelcase-keys';

type GuestsRequestsQuery = {
  tableNumber: number;
};

export const getGuests = async (
  req: Request<null, null, null, GuestsRequestsQuery>,
  res: Response
) => {
  try {
    const tableNumber = req.query.tableNumber;

    const guests = tableNumber
      ? await guestsRepository.findByTable(tableNumber)
      : await guestsRepository.findAll();

    res.json({
      count: guests.rowCount,
      data: guests.rows.map((row) => camelcaseKeys(row, { deep: true })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};
