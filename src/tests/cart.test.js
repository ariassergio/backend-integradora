const chai = import('chai');
const chaiHttp = import('chai-http');
const app = import('../app'); // Ruta a tu archivo principal de app
const Cart = import('../models/cart'); // Ruta a tu modelo de carrito

chai.should();
chai.use(chaiHttp);

describe('Carts API', () => {
    before(async () => {
        await Cart.deleteMany(); // Limpiar la colección antes de los tests
    });

    describe('POST /api/cart/:cid/products/add', () => {
        it('Debería agregar un producto al carrito', (done) => {
            const cartId = '5f50c31f0c9d440000a9c60d'; // Asegúrate de que este ID exista en tu base de datos
            const productId = '5f50c31f0c9d440000a9c60e'; // Asegúrate de que este ID exista en tu base de datos

            chai.request(app)
                .post(`/api/cart/${cartId}/products/add`)
                .send({ productId })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.status.should.equal('success');
                    done();
                });
        });
    });

    describe('DELETE /api/cart/:cid/products/:pid', () => {
        it('Debería eliminar un producto del carrito', (done) => {
            const cartId = '5f50c31f0c9d440000a9c60d'; // Asegúrate de que este ID exista en tu base de datos
            const productId = '5f50c31f0c9d440000a9c60e'; // Asegúrate de que este ID exista en tu base de datos

            chai.request(app)
                .delete(`/api/cart/${cartId}/products/${productId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.status.should.equal('success');
                    done();
                });
        });
    });

    describe('POST /api/cart/:cid/purchase', () => {
        it('Debería realizar una compra', (done) => {
            const cartId = '5f50c31f0c9d440000a9c60d'; // Asegúrate de que este ID exista en tu base de datos

            chai.request(app)
                .post(`/api/cart/${cartId}/purchase`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.status.should.equal('success');
                    done();
                });
        });
    });
});
