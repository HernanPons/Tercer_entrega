const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const port = 8080;

const productManager = ProductManager.getInstance('productos.json');

app.get('/products', async (req, res) => {
    try {
        await productManager.loadProducts();

        let limit = req.query.limit;

        if (limit) {
            limit = parseInt(limit);
            const limitedProducts = productManager.getProducts().slice(0, limit);
            res.json({ products: limitedProducts });
        } else {
            res.json({ products: productManager.getProducts() });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

app.get('/products/:pid', async (req, res) => {
    try {
        await productManager.loadProducts();

        const productId = parseInt(req.params.pid);
        const product = productManager.getProductById(productId);

        if (product) {
            res.json({ product });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

app.listen(port, () => {
    console.log(`El servidor está escuchando en http://localhost:${port}`);
});
