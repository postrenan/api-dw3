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

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://project3-2024a-renan-e-thales.vercel.app');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

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