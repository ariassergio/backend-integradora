const chai = import('chai');
const chaiHttp = import('chai-http');
const app = import('../app'); // Ruta a tu archivo principal de app
const Product = import('../models/product'); // Ruta a tu modelo de producto

chai.should();
chai.use(chaiHttp);

describe('Products API', () => {
    before(async () => {
        await Product.deleteMany(); // Limpiar la colección antes de los tests
    });

    describe('GET /api/product/all', () => {
        it('Debería obtener todos los productos', (done) => {
            chai.request(app)
                .get('/api/product/all')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.payload.should.be.a('array');
                    done();
                });
        });
    });

    describe('POST /api/product/add', () => {
        it('Debería agregar un nuevo producto', (done) => {
            const product = {
                title: 'Producto de prueba',
                description: 'Descripción del producto de prueba',
                category: 'Categoría de prueba',
                brand: 'Marca de prueba',
                price: 100,
                stock: 10,
                status: 'Disponible'
            };

            chai.request(app)
                .post('/api/product/add')
                .send(product)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.status.should.equal('success');
                    done();
                });
        });
    });

    describe('PUT /api/product/:id', () => {
        it('Debería actualizar un producto existente', (done) => {
            const product = new Product({
                title: 'Producto para actualizar',
                description: 'Descripción',
                category: 'Categoría',
                brand: 'Marca',
                price: 100,
                stock: 10,
                status: 'Disponible'
            });

            product.save((err, product) => {
                chai.request(app)
                    .put(`/api/product/${product._id}`)
                    .send({ price: 200 })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.status.should.equal('success');
                        done();
                    });
            });
        });
    });

    describe('DELETE /api/product/:id', () => {
        it('Debería eliminar un producto', (done) => {
            const product = new Product({
                title: 'Producto para eliminar',
                description: 'Descripción',
                category: 'Categoría',
                brand: 'Marca',
                price: 100,
                stock: 10,
                status: 'Disponible'
            });

            product.save((err, product) => {
                chai.request(app)
                    .delete(`/api/product/${product._id}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.status.should.equal('success');
                        done();
                    });
            });
        });
    });
});
