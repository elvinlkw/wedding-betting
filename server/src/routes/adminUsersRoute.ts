import express from 'express';
// import pool from '../db';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

const router = express.Router();

/**
 * Create an admin user
 */
// router.post('/', async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const user = {
//       username,
//       password,
//     };

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = await pool.query(
//       `INSERT INTO admin_user (
//       username, password
//     ) VALUES (
//       $1, $2
//     ) RETURNING *`,
//       [username, hashedPassword]
//     );

//     // JWT
//     const payload = {
//       user: {
//         id: newUser.rows[0].admin_user_id,
//       },
//     };

//     jwt.sign(
//       payload,
//       process.env.JWT_SECRET as string,
//       { expiresIn: 360000 },
//       (err, token) => {
//         if (err) throw err;
//         res.status(200).json({
//           token,
//           id: payload.user.id,
//           name: user.username,
//         });
//       }
//     );
//   } catch (err) {
//     const error = err as Error;
//     console.error(err);
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// });

export default router;
