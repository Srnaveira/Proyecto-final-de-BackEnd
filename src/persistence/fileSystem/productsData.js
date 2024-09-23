const fs = require('fs').promises;
const path = require('path');
const { logger } = require('../../utils/logger.js');

module.exports = {
    directoryPath: path.join(__dirname, 'src/persistence/json/'),
    productsFileName: 'productos.json',

    addProduct: async function (product) {
        try {
            if (!this.isValidProduct(product)) {
                logger.error("Error: El formato de producto ingresado no es válido");
                throw new Error('El producto no es válido');
            }
            if (await this.isCodeDuplicated(product.code)) {
                logger.error("Error: El código del producto ya está en uso");
                throw new Error('El código del producto ya está en uso');
            }
            let fileContent = await this.loadProducts();
            const lastId = fileContent.length > 0 ? fileContent[fileContent.length - 1].id : 0;
            product.id = lastId + 1;
            if (product.status === undefined) {
                product.status = true;
            }
            fileContent.push(product);
            await fs.writeFile(`${this.directoryPath}${this.productsFileName}`, JSON.stringify(fileContent, null, 2));
            logger.info("Se cargó correctamente el producto");
        } catch (error) {
            logger.error("Parece que hubo algún error en algunos de los campos ingresados");
            throw new Error("Error en alguno de los campos del producto");
        }
    },

    isValidProduct: function (product) {
        return (
            typeof product.title === 'string' &&
            typeof product.description === 'string' &&
            typeof product.code === 'string' &&
            typeof product.price === 'number' &&
            product.price > 0 &&
            (typeof product.status === 'boolean' || product.status === undefined) &&
            Number.isInteger(product.stock) &&
            product.stock >= 0 &&
            typeof product.category === 'string' &&
            (typeof product.thumbnail === 'string' || product.thumbnail === undefined)
        );
    },

    isCodeDuplicated: async function (code) {
        try {
            const fileContent = await this.loadProducts();
            return fileContent.some(p => p.code === code);
        } catch (error) {
            return false;
        }
    },

    loadProducts: async function () {
        try {
            const products = await fs.readFile(`${this.directoryPath}${this.productsFileName}`, 'utf8');
            return JSON.parse(products);
        } catch (error) {
            await fs.writeFile(`${this.directoryPath}${this.productsFileName}`, JSON.stringify([], null, 2));
            const products = await fs.readFile(`${this.directoryPath}${this.productsFileName}`, 'utf8');
            return JSON.parse(products);
        }
    },

    getAllProducts: async function () {
        try {
            return await this.loadProducts();
        } catch (error) {
            logger.error("Error al traer los productos");
            throw new Error("Error al traer los productos");
        }
    },

    getProductById: async function (idProduct) {
        try {
            const fileContent = await this.loadProducts();
            const searching = fileContent.find(product => product.id === idProduct);
            if (!searching) {
                logger.info(`El id ingresado: ${idProduct} no corresponde a ningún id de productos`);
                return;
            }
            return searching;
        } catch (error) {
            logger.error(`El id ingresado: ${idProduct} no corresponde a ningún id de productos`);
            throw new Error("Error al buscar el producto por id");
        }
    },

    updateProduct: async function (idProduct, productUpdate) {
        try {
            const products = await this.loadProducts();
            const productIndex = products.findIndex(element => element.id === idProduct);
            if (productIndex === -1) {
                logger.error(`No se encontró ningún producto con id ${idProduct}.`);
                throw new Error(`No se encontró el producto con id ${idProduct}`);
            }
            Object.assign(products[productIndex], productUpdate);
            await fs.writeFile(`${this.directoryPath}${this.productsFileName}`, JSON.stringify(products, null, 2));
            logger.info("Producto actualizado correctamente.");
        } catch (error) {
            logger.error("No se pudo actualizar el producto:", error);
            throw error;
        }
    },

    deleteProduct: async function (idProduct) {
        try {
            const fileContent = await this.loadProducts();
            if (!fileContent.find(p => p.id === idProduct)) {
                logger.error(`El producto id ingresado: ${idProduct} no existe`);
                throw new Error(`El producto id ingresado: ${idProduct} no existe`);
            }
            const newArray = fileContent.filter(element => element.id !== idProduct);
            await fs.writeFile(`${this.directoryPath}${this.productsFileName}`, JSON.stringify(newArray, null, 2));
        } catch (error) {
            logger.error("Dio este mensaje de error ", error);
            throw error;
        }
    },

    getProductByFilter: async function (filter, limit, offset, sortOptions) {
        try {
            let products = await this.loadProducts();
            products = products.filter(product => {
            return Object.keys(filter).every(key => product[key] === filter[key]);
            });
            if (sortOptions) {
                const [sortKey, sortOrder] = Object.entries(sortOptions)[0];
                products.sort((a, b) => {
                    if (sortOrder === 'asc') {
                        return a[sortKey] > b[sortKey] ? 1 : -1;
                    } else {
                        return a[sortKey] < b[sortKey] ? 1 : -1;
                    }
                });
            }
            const start = offset || 0;
            const end = limit ? start + limit : products.length;
            return products.slice(start, end);
        } catch (error) {
            logger.error(`Problemas al filtrar los resultados`);
            throw new Error("Error al filtrar los resultados");
        }
    },

    totalProducts: async function () {
        try {
            const products = await this.loadProducts();
            return products.length;
        } catch (error) {
            logger.error(`Problemas al filtrar los resultados`);
            throw new Error("Error al contar los productos");
        }
    }
}
