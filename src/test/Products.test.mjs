import * as chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import productsModel from '../persistence/models/products.model.js';


const expect = chai.expect;
const request = supertest('http://localhost:8080');

  
describe('Products API', function() { // `function` instead of arrow function to use `this.timeout`
    this.timeout(10000); // Aumenta el timeout para todas las pruebas en este bloque

    before(async function() {
        this.timeout(10000);
        try {
            await mongoose.connect('INGRESE CREDENCIALES MONGODB');
            console.log('Conexión a MongoDB exitosa');
        } catch (error) {
            console.error('Error al conectar a MongoDB:', error);
            throw error;
        }
    });
    after(async function() {
        this.timeout(10000); // Timeout para cerrar la conexión
        await productsModel.deleteMany({});
        await mongoose.connection.close();
    });

    describe('POST /api/products', function() {
        it('Debería agregar un producto nuevo', async function() {
            this.timeout(10000); // Timeout para esta prueba específica
            const product = {
                title: 'Producto Test2',
                description: 'Descripción de prueba2',
                price: 100,
                code: 'PRD002',
                role: 'admin',
                category: 'Categoría Test2',
                stock: 10
            };

            const res = await request.post('/api/products').send(product);
            expect(res.status).to.equal(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message').eql('Product Agregado Correctamente');
            expect(res.body.product).to.have.property('title').eql(product.title);
        });

        it('Debería fallar si falta un campo requerido', async function() {
            this.timeout(10000); // Timeout para esta prueba específica
            const product = {
                description: 'Descripción de prueba',
                price: 100
            };

            const res = await request.post('/api/products').send(product);
            expect(res.status).to.equal(500);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message').eql('Error interno del servidor');
        });
    });

    describe('GET /api/products/:pid', function() {
        it('Debería obtener un producto por su ID', async function() {
            this.timeout(10000); // Timeout para esta prueba específica
            const product = await productsModel.create({
                title: 'Producto Test',
                description: 'Descripción de prueba',
                price: 100,
                code: 'PRD001',
                category: 'Categoría Test',
                stock: 10,
                role: 'admin'
            });
            const res = await request.get(`/api/products/${product._id}`);
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('title').eql(product.title);
        });

        it('Debería devolver un error si el producto no existe', async function() {
            this.timeout(10000); // Timeout para esta prueba específica
            const nonExistentId = new mongoose.Types.ObjectId();
            const res = await request.get(`/api/products/${nonExistentId}`);
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('message').eql('El producto Solicitado No existe');
        });
    });

    describe('PUT /api/products/:pid', function() {
        it('Debería actualizar un producto existente', async function() {
            this.timeout(10000); // Timeout para esta prueba específica
            const product = await productsModel.create({
                title: 'Producto Test3',
                description: 'Descripción de prueba3',
                price: 100,
                code: 'PRD003',
                category: 'Categoría Test3',
                stock: 10,
                role: 'admin'
            });
            const res = await request.put(`/api/products/${product._id}`).send({ title: 'Producto Actualizado' }); 
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message').eql('Producto Actualizado');
        });

        it('Debería devolver un error si el producto no se puede actualizar', async function() {
            this.timeout(10000); // Timeout para esta prueba específica
            const nonExistentId = new mongoose.Types.ObjectId();
            const res = await request.put(`/api/products/${nonExistentId}`).send({ title: 'Producto Actualizado' });
            expect(res.status).to.equal(500);
            expect(res.body).to.have.property('message').eql('Error interno del servidor');
        });
    });

    describe('DELETE /api/products/:pid', function() {
        it('Debería eliminar un producto existente', async function() {
            this.timeout(10000); // Timeout para esta prueba específica
            const product = await productsModel.create({
                title: 'Producto Test4',
                description: 'Descripción de prueba4',
                price: 100,
                code: 'PRD004',
                category: 'Categoría Test4',
                stock: 10,
                role: 'admin'
            });

            const res = await request.delete(`/api/products/${product._id}`);
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message').eql('Producto Eliminado Correctamente');
        });

        it('Debería devolver un error si el producto no se puede eliminar', async function() {
            this.timeout(10000); // Timeout para esta prueba específica
            const nonExistentId = new mongoose.Types.ObjectId();
            const res = await request.delete(`/api/products/${nonExistentId}`);
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('message').eql('Producto no encontrado');
        });
       
    });

});
