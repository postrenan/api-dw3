import { PrismaClient } from '@prisma/client';
import { ZenStackMiddleware } from '@zenstackhq/server/express';
import RestApiHandler from '@zenstackhq/server/api/rest';
import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { compareSync } from 'bcryptjs';
import type { Request } from 'express';
import { enhance } from "@zenstackhq/runtime";
import swaggerUI from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

const options = { customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.css' };
const spec = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../estoque-api.json'), 'utf8')
);


const app = express();
app.use(express.json());
dotenv.config();

const prisma = new PrismaClient();

const apiHandler = RestApiHandler({ endpoint: 'http://localhost:3000/api' });

app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(spec, options));

// Suas outras rotas e middleware aqui
app.post('/api/user', (req, res) => {
    res.send('Resposta do servidor para POST');
});

app.use(
    '/api',
    ZenStackMiddleware({
        getPrisma: () => {
            return enhance(prisma);
        },
        handler: apiHandler
    })
);

export default app;