import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

type JwtPayload = {
  user: {
    id: string;
  };
};

export const auth = (req: Request, res: Response, next: NextFunction): void => {
  // Get the token from the header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    res.status(401).json({ msg: 'No Token, Authorization Denied' });
    return;
  }

  // Verify Token
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
    return;
  }
};
