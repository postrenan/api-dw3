import { PrismaClient } from '@prisma/client';
import { enhance } from '@zenstackhq/runtime';
import { ZenStackMiddleware } from '@zenstackhq/server/express';
import { compareSync } from 'bcryptjs';
import dotenv from 'dotenv';
import type {NextFunction, Request} from 'express';
import express from 'express';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

// @ts-ignore
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors);

const prisma = new PrismaClient();

// load .env environment variables
dotenv.config();

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({
        where: { email },
    });
    if (!user || !compareSync(password, user.password)) {
        res.status(401).json({ error: 'Invalid credentials' });
    } else {
        // sign a JWT token and return it in the response
        const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!);
        res.json({ id: user.id, email: user.email, token });
    }
});

const allowCors = (fn: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void) =>
    async (req: NextApiRequest, res: NextApiResponse) => {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Origin', '*');
        // another common pattern
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
        res.setHeader(
            'Access-Control-Allow-Headers',
            'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
        );
        if (req.method === 'OPTIONS') {
            res.status(200).end();
            return;
        }
        return fn(req, res);
    };

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    const d = new Date();
    res.end(d.toString());
};

export default allowCors(handler);


function getUser(req: Request) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return undefined;
    }
    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        return { id: decoded.sub };
    } catch {
        // bad token
        return undefined;
    }
}


app.listen(3000, () =>
    console.log('🚀 Server ready at: http://localhost:3000')
);

app.use(
    '/api',
    ZenStackMiddleware({
        getPrisma: (req) => {
            return enhance(prisma, { user: getUser(req) });
        },
    })
);