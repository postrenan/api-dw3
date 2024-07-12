import { PrismaClient } from '@prisma/client';
import { enhance } from '@zenstackhq/runtime';
import { ZenStackMiddleware } from '@zenstackhq/server/express';
import { compareSync } from 'bcryptjs';
import dotenv from 'dotenv';
import type {NextFunction, Request} from 'express';
import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

dotenv.config();

app.listen(3000, () =>
    console.log('🚀 Server ready at: http://localhost:3000')
);

app.use(
    '/api',
    ZenStackMiddleware({
        getPrisma: (req) => {
            return enhance(prisma);
        },
    })
);

