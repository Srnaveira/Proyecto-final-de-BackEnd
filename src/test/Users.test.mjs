import * as chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import usersModel from '../persistence/models/users.model.js';

const expect = chai.expect;
const request = supertest('http://localhost:8080');

describe('Users API', function () {
    this.timeout(10000); // Aumenta el timeout para todas las pruebas en este bloque

    before(async function () {
        this.timeout(10000);
        try {
            await mongoose.connect('INGRESE CREDENCIALES MONGODB');
            console.log('Conexión a MongoDB exitosa');
        } catch (error) {
            console.error('Error al conectar a MongoDB:', error);
            throw error;
        }
    });

    after(async function () {
        this.timeout(10000);
        await usersModel.deleteMany({});
        await mongoose.connection.close();
    });

    describe('POST /api/sessions/register', function () {
        it('Debería registrar un nuevo usuario', async function () {
            const newUser = {
                first_name: 'John',
                last_name: 'Doe',
                email: 'johndoe@example.com',
                age: 30,
                password: 'Password123!',
            };

            const res = await request.post('/api/sessions/register').send(newUser);
            expect(res.status).to.equal(302);
        });
    });

    describe('POST /api/sessions/login', function () {
        it('Debería autenticar al usuario', async function () {
            const user = new usersModel({
                first_name: 'Jane',
                last_name: 'Doe',
                email: 'janedoe@example.com',
                age: 25,
                password: 'Password123!',
                cartId: new mongoose.Types.ObjectId()
            });
            await user.save();

            const res = await request.post('/api/sessions/login').send({
                email: user.email,
                password: user.password
            });
            expect(res.status).to.equal(302);
            expect(res.body).to.be.an('object');
        });

        it('Debería fallar con credenciales incorrectas', async function () {
            const res = await request.post('/api/sessions/login').send({
                email: 'wrong@example.com',
                password: 'incorrectPassword'
            });
            expect(res.status).to.equal(302);
        });
    });

});
