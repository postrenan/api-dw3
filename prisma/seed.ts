import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const itemData: Prisma.ItemCreateInput[] = [
    {
        id: 'sabonete',
        name: 'Sabonete',
        category: 'Higiene',
    },
    {
        id: 'detergente',
        name: 'Detergente',
        category: 'Limpeza',
    },
    {
        id: 'arroz',
        name: 'Arroz',
        category: 'Suprimento',
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
        console.log(`Upserted Pet with id: ${item.id}`);
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