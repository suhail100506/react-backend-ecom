const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products', message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product Not Found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product', message: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const newProduct = new Product({
            name: req.body.name,
            image: req.body.image || '',
            price: req.body.price,
            originalPrice: req.body.originalPrice || 0,
            description: req.body.description || '',
            category: req.body.category || 'Other',
            stock: req.body.stock || 0
        });

        await newProduct.save();

        const products = await Product.find();
        fs.writeFileSync("data/products.json", JSON.stringify(products, null, 2));

        res.status(201).json({ message: "Product Created Successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create product', message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (updatedProduct) {
            const products = await Product.find();
            fs.writeFileSync("data/products.json", JSON.stringify(products, null, 2));

            res.json({ message: 'Product Updated Successfully', product: updatedProduct });
        } else {
            res.status(404).json({ error: 'Product Not Found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product', message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (deletedProduct) {
            const products = await Product.find();
            fs.writeFileSync("data/products.json", JSON.stringify(products, null, 2));

            res.status(200).json({ message: 'Product Deleted Successfully' });
        } else {
            res.status(404).json({ error: 'Product Not Found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product', message: error.message });
    }
});

module.exports = router;