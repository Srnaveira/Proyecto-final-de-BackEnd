import * as chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import cartsModel from '../persistence/models/carts.model.js';
import productsModel from '../persistence/models/products.model.js';



const expect = chai.expect;
const request = supertest('http://localhost:8080');



describe('Carts API', function () {
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
        await cartsModel.deleteMany({});
        await productsModel.deleteMany({});
        await mongoose.connection.close();
    });

    describe('POST /api/carts', function () {
        it('Debería crear un carrito nuevo', async function () {
            const res = await request.post('/api/carts');
            expect(res.status).to.equal(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message').eql('Se a creado correctamente el nuevo cart');
            expect(res.body.cart).to.be.an('object');
            expect(res.body.cart).to.have.property('product').that.is.an('array').that.is.empty;
        });
    });

    describe('GET /api/carts', function () {
        it('Debería obtener todos los carritos', async function () {
            const res = await request.get('/api/carts');
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message').eql('Se envio el contenido de todos los carritos');
            expect(res.body.cart).to.be.an('array');
        });
    });

    describe('GET /api/carts/:cid', function () {
        it('Debería obtener un carrito por su ID', async function () {
            const cart = await cartsModel.create({ product: [] });
            const res = await request.get(`/api/carts/${cart._id}`);
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
        });

        it('Debería devolver un error si el carrito no existe', async function () {
            const nonExistentId = new mongoose.Types.ObjectId();
            const res = await request.get(`/api/carts/${nonExistentId}`);
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('message').eql('No existe ese producto');
        });
    });

    describe('POST /api/carts/:cid/product/:pid', function () {
        it('Debería agregar un producto al carrito', async function () {
            const cart = await cartsModel.create({ product: [] });
            const product = await productsModel.create({
                title: 'Producto Test',
                description: 'Descripción de prueba',
                price: 100,
                code: 'PRD001',
                category: 'Categoría Test',
                stock: 10,
            });

            const res = await request.post(`/api/carts/${cart._id}/product/${product._id}`);
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message').eql('Producto agregado o actualizado correctamente');
        });
    });

});
