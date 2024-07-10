import { PrismaClient, Prisma } from '@prisma/client';
import {randomUUID} from "node:crypto";

const prisma = new PrismaClient();

const itemData: Prisma.ItemCreateInput[] = [
    {
        id: randomUUID(),
        name: 'Sabonete',
        category: 'Higiene',
        description: 'caixa de sabonetes contendo 10 unidade',
        qtd: 10,
        kgl: 1,
        dataVal: '2024-07-02T20:40:37Z',
        perecivel: false,
    },
    {
        id: randomUUID(),
        name: 'Detergente',
        category: 'Limpeza',
        description: 'Detergentes de 500 ml cada da marca bom brilho cheiro de coco',
        qtd: 25,
        kgl: 12.5,
        dataVal: '2024-07-02T20:40:37Z',
        perecivel: false
    },
    {
        id: randomUUID(),
        name: 'Arroz',
        category: 'Suprimento',
        description: 'pacotes de arroz da marca bom arroz 4kg cada pacote',
        qtd: 10,
        kgl: 40,
        dataVal: '2024-07-02T20:40:37Z',
        perecivel: true
    },
];


async function main() {
    console.log(`Start seeding ...`);
    for (const i of itemData) {

        const item = await prisma.item.upsert({
            where: { id: i.id },
            create: i,
            update: {},
        });
        console.log(`Upserted Item with id: ${item.id}`);
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