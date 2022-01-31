// require sqlite to be able to use CRUD-OPERATIONS on our database
const sqlite3 = require('sqlite3');
const {
    open
} = require('sqlite');
const routes = require('./routes');

// create a database promise object by connecting to database
const dbPromise = (async () => {
    return open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });
})();

const Login = async (data) => {
    console.log(data);
    try {
        const dbCon = await dbPromise
        const username = await dbCon.get(`SELECT username FROM users WHERE username=? AND password=?`, [data.username, data.password]);
        if (username === undefined) {
            return {
                error: 'Access Denied! Revise your information.'
            };
        } else {
            return username;
        }
    } catch (error) {
        throw new Error(error);
    }
}
// GET USERS BY ID
const getUsers = async () => {
    //returnera användare
    try {
        const dbCon = await dbPromise;
        const users = await dbCon.all('SELECT firstname, surname, email, id FROM users ORDER BY id ASC');
        return users;

    } catch (error) {
        throw new Error(error)
    }
}
//GET ALL PRODUCTS
const getProducts = async () => {
    try {
        const dbCon = await dbPromise;
        const products = await dbCon.all('SELECT * FROM products ORDER by id ASC')
        return products;
    } catch (error) {
        throw new Error(error)
    }
};
// GET PRODUCT BY ID
const ProdById = async (id) => {
    try {
        const dbCon = await dbPromise;
        const products = await dbCon.get("SELECT * FROM products WHERE id = ?", [id]);
        return products;
    } catch (error) {
        throw new Error(error)
    }
}
// GET USER BY ID
const UserById = async () => {
    try {
        const dbCon = await dbPromise;
        const users = await dbCon.all('SELECT firstname, surname, email, id FROM users ORDER BY id ASC')
        return users;
    } catch (error) {
        throw new Error(error)
    }
}
// AD PRODUCTS TO DATABASE
const AddProd = async (data) => {
    try {
        const dbCon = await dbPromise;
        await dbCon.run(`INSERT INTO products (name, description, price, picture) VALUES(?,?,?,?)`, [data.name, data.description, data.price, data.picture]);
        const lastId = await dbCon.get("SELECT id FROM products ORDER BY id DESC");
        return {
            status: "Product Added!",
            id: lastId.id
        };

    } catch (error) {
        throw new Error(error)
    }
}
// UPDATE EXISTING PRODUCT
const UpdateProd = async (id, data) => {
    try {
        const dbCon = await dbPromise;
        await dbCon.run(`UPDATE products  SET name=?, description=?, price =? , picture=? WHERE id= ?`, [data.name, data.description, data.price, data.picture, id]);
        return `Product successfully updated.`
    } catch (error) {
        throw new Error(error)
    }
}
// DELETE EXISTING PRODUCT
const DeleteProd = async (id) => {
    try {
        const dbCon = await dbPromise;
        await dbCon.run("DELETE FROM products WHERE id=?", [id]);
        return {
            status: 'Product Removed!'
        };
    } catch (error) {
        throw new Error(error)
    }
}

// export list
module.exports = {
    getUsers: getUsers,
    getProducts: getProducts,
    ProdById: ProdById,
    Login: Login,
    UserById: UserById,
    DeleteProd: DeleteProd,
    AddProd: AddProd,
    UpdateProd: UpdateProd
};