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

type CreateGuestsBody = {
  firstName: string;
  lastName: string;
  tableNumber: number | null;
};

export const createGuest = async (
  req: Request<{}, {}, CreateGuestsBody>,
  res: Response
) => {
  try {
    const newGuest = await guestsRepository.insert(req.body);

    res.json(camelcaseKeys(newGuest.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

type UpdateGuestsParams = {
  id: string;
};

export const updateGuest = async (
  req: Request<UpdateGuestsParams, {}, CreateGuestsBody>,
  res: Response
) => {
  try {
    const id = req.params.id;

    const exists = await guestsRepository.findById(id);
    if (!exists.rowCount) {
      res.status(404).json({
        message: `Guest with id: ${id} not found`,
      });
      return;
    }

    const updatedGuest = await guestsRepository.update(id, req.body);

    res.json(camelcaseKeys(updatedGuest.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

type DeleteGuestsParams = {
  id: string;
};
export const deleteGuest = async (
  req: Request<DeleteGuestsParams>,
  res: Response
) => {
  const id = req.params.id;

  const exists = await guestsRepository.findById(id);
  if (!exists.rowCount) {
    res.status(404).json({
      message: `Guest with id: ${id} not found`,
    });
    return;
  }

  await guestsRepository.remove(id);

  res.json({ message: `Success removed guest` });

  try {
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};
