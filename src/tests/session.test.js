const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Ruta a tu archivo principal de app

chai.should();
chai.use(chaiHttp);

describe('Sessions API', () => {
    describe('POST /api/session/login', () => {
        it('Debería iniciar sesión con credenciales válidas', (done) => {
            const user = {
                email: 'test@example.com',
                password: 'password123'
            };

            chai.request(app)
                .post('/api/session/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.status.should.equal('success');
                    done();
                });
        });

        it('No debería iniciar sesión con credenciales inválidas', (done) => {
            const user = {
                email: 'wrong@example.com',
                password: 'wrongpassword'
            };

            chai.request(app)
                .post('/api/session/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.status.should.equal('failure');
                    done();
                });
        });
    });

    describe('POST /api/session/register', () => {
        it('Debería registrar un nuevo usuario', (done) => {
            const user = {
                email: 'newuser@example.com',
                password: 'password123',
                confirmPassword: 'password123'
            };

            chai.request(app)
                .post('/api/session/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.status.should.equal('success');
                    done();
                });
        });

        it('No debería registrar un usuario con un email ya existente', (done) => {
            const user = {
                email: 'test@example.com',
                password: 'password123',
                confirmPassword: 'password123'
            };

            chai.request(app)
                .post('/api/session/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.status.should.equal('failure');
                    done();
                });
        });
    });

    describe('GET /api/session/logout', () => {
        it('Debería cerrar sesión', (done) => {
            chai.request(app)
                .get('/api/session/logout')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.status.should.equal('success');
                    done();
                });
        });
    });
});
