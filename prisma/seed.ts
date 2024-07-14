import { PrismaClient, Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';

const prisma = new PrismaClient();

const categoryData: Prisma.CategoriaCreateInput[] = [
    {
        id: '1',
        nome: 'Higiene',
    },
    {
        id: '2',
        nome: 'Limpeza',
    },
    {
        id: '3',
        nome: 'Suprimento',
    },
];

const userData: Prisma.UserCreateInput[] = [
    {
        id: '1',
        email: 'renan@gmail.com',
        name: 'Renan Bick',
        password: 'abc123',
    },
    {
        id: '2',
        email: 'thales@gmail.com',
        name: 'Thales Laggeman',
        password: 'abc123',
    },
];

const itemData: Prisma.ItemCreateInput[] = [
    {
        id: randomUUID(),
        name: 'Sabonete',
        description: 'caixa de sabonetes contendo 10 unidades',
        qtd: 10,
        peso: '1Kg',
        dataVal: '2024-07-02T20:40:37Z',
        perecivel: false,
        user: {
            connect: {
                id: '1',
            },
        },
        itemCategoria: {
            create: [
                {
                    categoria: {
                        connect: { id: '1' },
                    },
                },
            ],
        },
    },
    {
        id: randomUUID(),
        name: 'Detergente',
        description: 'Detergentes de 500 ml cada da marca Bom Bril, cheiro de coco',
        qtd: 25,
        peso: '12.5Kg',
        dataVal: '2024-07-02T20:40:37Z',
        perecivel: false,
        user: {
            connect: {
                id: '1',
            },
        },
        itemCategoria: {
            create: [
                {
                    categoria: {
                        connect: { id: '2' },
                    },
                },
            ],
        },
    },
    {
        id: randomUUID(),
        name: 'Arroz',
        description: 'pacotes de arroz da marca Bom Arroz, 4kg cada pacote',
        qtd: 10,
        peso: '40Kg',
        dataVal: '2024-07-02T20:40:37Z',
        perecivel: true,
        user: {
            connect: {
                id: '2',
            },
        },
        itemCategoria: {
            create: [
                {
                    categoria: {
                        connect: { id: '3' },
                    },
                },
            ],
        },
    },
];


const estoqueData: Prisma.EstoqueCreateInput[] = [
    {
        id: randomUUID(),
        item: {
            connect: { id: itemData[0].id },
        },
        user: {
            connect: { id: '1' },
        },
    },
    {
        id: randomUUID(),
        item: {
            connect: { id: itemData[1].id },
        },
        user: {
            connect: { id: '1' },
        },
    },
    {
        id: randomUUID(),
        item: {
            connect: { id: itemData[2].id },
        },
        user: {
            connect: { id: '2' },
        },
    },
];

async function main() {
    console.log(`Start seeding ...`);

    // Seed para categorias
    for (const c of categoryData) {
        const category = await prisma.categoria.upsert({
            where: { id: c.id },
            create: c,
            update: {},
        });
        console.log(`Upserted category with id: ${category.id}`);
    }

    // Seed para usuários
    for (const u of userData) {
        const user = await prisma.user.upsert({
            where: { id: u.id },
            create: u,
            update: {},
        });
        console.log(`Upserted User with id: ${user.id}`);
    }

    // Seed para itens
    for (const i of itemData) {
        const item = await prisma.item.upsert({
            where: { id: i.id },
            create: i,
            update: {},
        });
        console.log(`Upserted Item with id: ${item.id}`);
    }

    // Seed para estoque
    for (const e of estoqueData) {
        const estoque = await prisma.estoque.upsert({
            where: { id: e.id },
            create: e,
            update: {},
        });
        console.log(`Upserted Estoque with id: ${estoque.id}`);
    }

    console.log(`Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
