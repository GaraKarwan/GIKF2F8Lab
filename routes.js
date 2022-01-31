const routes = require('express').Router();
const dbService = require('./database')
const multer = require('multer');
const upload = multer({
    dest: 'upload/'
});
const fs = require('fs').promises;

//route users
routes.get('/users/', async (req, res) => {
    try {
        const users = await dbService.getUsers();
        res.json(users);
    } catch (error) {
        res.json('No sir!');
    }
});

//route single user
routes.get('/users/:id', async (req, res) => {
    const users = await dbService.UserById();
    const user = users.find((users) => {
        return users.id == req.params.id;
    });
    if (user) {
        res.json(user);
    } else {
        res.status(404)
            .json(`User with id: ${req.params.id} not found`);
    }
});

//Login user
routes.post('/login/', async (req, res) => {
    try {
        const username = await dbService.Login(req.body);
        res.json(username);
    } catch (error) {
        res.json("Login Failed.")

    }
});

//route products
routes.get('/products/', async (req, res) => {
    try {
        const product = await dbService.getProducts();
        res.json(product);
    } catch (error) {
        res.json('No sir!');
    }
});

//route single product
routes.get('/products/:id', async (req, res) => {
    try {
        const product = await dbService.ProdById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.json(`Product with ID: ${req.params.id} is not part of the catalog`)
        }
    } catch {
        console.log(error)
    }
});

// add product
routes.post('/products/', upload.single('file'), async (req, res) => {
    if (req.body.name.length == 0 &&
        req.body.name.length == 0 &&
        req.body.description.length == 0 &&
        !isNaN(parseInt(req.body.price)) &&
        req.body.price == 0) {
        res.send('You need to fill in corect data in the fields');
    } else {
        const productInfo = req.body;
        const result = await dbService.AddProd(productInfo);
        const id = result.id;
        const file = req.file;
        const exts = file.originalname.split('.');
        const fileEnd = exts[exts.length - 1];
        const fileName = './public/images/' + id + '.' + fileEnd;
        try {
            const fileWrite = await fs.rename(file.path, fileName);
            if (!fileWrite) {
                productInfo.id = id.id;
                productInfo.picture = '/images/' + id + '.' + fileEnd;
                productInfo.name = req.body.name;
                productInfo.price = req.body.price;
                await dbService.UpdateProd(id, productInfo);
                res.json({
                    'status': 'Product added'
                })
            } else {
                throw error;
            }
        } catch (error) {
            console.log(error);
            await fs.unlink(file.path);
            res.status(400).json(error);
        }
    }
});

//Update Product
routes.put('/products/:id', async (req, res) => {
    if (req.body.name.length > 0 &&
        req.body.name.length < 64 &&
        req.body.description.length < 132 &&
        !isNaN(parseInt(req.body.price)) &&
        req.body.price > 0 &&
        await dbService.ProdById(req.params.id)) {
        try {
            const updatedProd = await dbService.UpdateProd(req.params.id, req.body);
            console.log(updatedProd);
            res.json(`Product with ID: ${req.params.id} successfully updated.`)
        } catch (error) {
            console.log(error);
        }
    } else {
        res.json('The update was not successful.')
    }
});


//Delete product
routes.delete('/products/:id', async (req, res) => {
    try {
        const p = await dbService.ProdById(req.params.id);
        await dbService.DeleteProd(req.params.id);
        if (p) {
            res.json(`product with id ${req.params.id} is deleted`);
        } else {
            res.json(`Product with ${req.params.id} does not exist`)
        }
    } catch (error) {
        res.json(error);
    }
});

//Add file to product
routes.post('/files/:id', upload.array('files'), async (req, res) => {
    const fileUpload = req.files;
    let accepted = true;
    for (let i = 0; i < fileUpload.length; i++) {
        const file = fileUpload[i];
        const exts = file.originalname.split('.');
        const fileEnd = exts[exts.length - 1];
        const product = req.params.id + '_' + i;
        const fileName = './upload/' + product + '.' + fileEnd;
        try {
            const fileWrite = await fs.rename(file.path, fileName);
            if (!fileWrite) {
                accepted = false;
            }
        } catch (error) {
            console.log(error);
            await fs.unlink(file.path)
            res.status(400).json(error);
        }
    }
    if (!accepted) {
        res.json({
            "Status": " Ok"
        });
    } else {
        res.json({
            "Status": " Ok"
        });
    }
});

module.exports = routes; //Export module --> route