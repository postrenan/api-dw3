import { PrismaClient, Prisma } from '@prisma/client';
import {randomUUID} from "node:crypto";

const prisma = new PrismaClient();

const itemData: Prisma.ItemCreateInput[] = [
    {
        id: randomUUID(),
        name: 'Sabonete',
        category: 'Higiene',
        description: '',
        qtd: 0,
        kgl: 0,
        dataVal: '2024-07-02T20:40:37Z'
    },
    {
        id: randomUUID(),
        name: 'Detergente',
        category: 'Limpeza',
        description: '',
        qtd: 0,
        kgl: 0,
        dataVal: '2024-07-02T20:40:37Z'
    },
    {
        id: randomUUID(),
        name: 'Arroz',
        category: 'Suprimento',
        description: '',
        qtd: 0,
        kgl: 0,
        dataVal: '2024-07-02T20:40:37Z'
    },
];


const userData: Prisma.UserCreateInput[] = [
    {
        id: randomUUID(),
        name: 'thales lagemman',
        email:  'thales@gmail.com',
        password: randomUUID()
    },
];


async function main() {
    console.log(`Start seeding ...`);
    for (const i of itemData) {
        // create pet if not exists
        const item = await prisma.item.upsert({
            where: { id: i.id },
            create: i,
            update: {},
        });
        console.log(`Upserted Item with id: ${item.id}`);
    }
    for (const u of userData) {
        const user = await prisma.user.upsert({
            where: { id: u.id },
            create: u,
            update: {},
        });
        console.log(`Upserted User with id: ${user.id}`);
    }
    console.log(`Seeding finished.`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });