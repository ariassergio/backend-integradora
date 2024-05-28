import faker from 'faker';

// Generar 100 productos falsos
export function generateMockProducts() {
    const products = [];
    for (let i = 0; i < 100; i++) {
        products.push({
            _id: faker.datatype.uuid(),
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            category: faker.commerce.department(),
            brand: faker.company.companyName(),
            price: faker.commerce.price(),
            stock: faker.datatype.number({ min: 0, max: 100 }),
            status: faker.random.boolean()
        });
    }
    return products;
}
