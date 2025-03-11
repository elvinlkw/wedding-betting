import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../db';
import { check, validationResult } from 'express-validator';
import { auth } from '../middleware';

const router = express.Router();

router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const user = await pool.query(
      `SELECT admin_user_id, username FROM admin_user WHERE admin_user_id = $1`,
      [req.user?.id]
    );
    res.json({
      id: req.user?.id,
      name: user.rows[0].username,
    });
    return;
  } catch (err) {
    const error = err as Error;
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});

/**
 * POST Authenticate User and Get Token
 */
router.post(
  '/',
  [
    check('username', 'Username is required').exists(),
    check('password', 'Password is required').exists(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { username, password } = req.body;

    try {
      // Checks if email already exist
      const user = await pool.query(
        `SELECT * from admin_user where username=$1`,
        [username]
      );

      if (!user.rowCount) {
        res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        return;
      }

      const userData = user.rows[0];

      const isMatch = await bcrypt.compare(password, userData.password);

      if (!isMatch) {
        res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        return;
      }

      // JWT
      const payload = {
        user: {
          id: userData.admin_user_id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET as string,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
            id: payload.user.id,
            name: userData.username,
          });
        }
      );
    } catch (err) {
      const error = err as Error;
      console.log(error.message);
      res.status(500).send('Server Error');
    }
  }
);

export default router;
