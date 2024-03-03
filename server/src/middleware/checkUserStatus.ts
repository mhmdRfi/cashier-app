import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUserStatus(req: Request, res: Response, next: NextFunction) {
  const { email } = req.body;
  const user = await prisma.users.findUnique({
    where: { email }
  });

  if (user && user.status === 'disabled') {
    return res.status(403).send('Account is disabled.');
  }

  next();
}

export default checkUserStatus;