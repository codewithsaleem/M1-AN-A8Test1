let express = require("express");
let app = express();

app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
})

var port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Listening on port ${port}`));

let { data } = require("./data.js");

//fetching data through api from shops:-------------------------------------------
app.get("/shops", function (req, res) {
    res.send(data.shops);
})

app.post("/shops", function (req, res) {
    let body = req.body;
    let maxId = data.shops.reduce((acc, curr) => (curr.shopid >= acc ? curr.shopid : acc), 0);
    let newId = maxId + 1;
    let newShop = { shopid: newId, ...body };
    data.shops.push(newShop);
    res.send(newShop);
})


//fetching data through api from products:-------------------------------------------
app.get("/products", function (req, res) {
    res.send(data.products);
})

app.post("/products", function (req, res) {
    let body = req.body;
    let maxId = data.products.reduce((acc, curr) => (curr.productid >= acc ? curr.productid : acc), 0);
    let newId = maxId + 1;
    let newProducts = { productid: newId, ...body };
    data.products.push(newProducts);
    res.send(newProducts);
})

app.put("/products/:productid", function (req, res) {
    let productid = +req.params.productid;
    let body = req.body;

    let index = data.products.findIndex((ele) => ele.productid === productid);
    if (index >= 0) {
        let updatedProduct = { ...body };
        data.products[index] = updatedProduct;
        res.send(updatedProduct);
    } else {
        res.status(404).send("No product found");
    }
})

app.get("/products/:productid", function (req, res) {
    let productid = +req.params.productid;
    let body = req.body;

    let index = data.products.find((ele) => ele.productid === productid);
    if (index) {
        res.send(index);
    } else {
        res.status(404).send("No product found");
    }
})

//fetching data through api from purchases:-------------------------------------------
app.get("/purchases", function (req, res) {
    const shopid = req.query.shopid;
    const productid = req.query.productid; 
    const sort = req.query.sort;

    let filteredPurchases = data.purchases;

    if (shopid) {
        filteredPurchases = filteredPurchases.filter((purchase) => {
            const shopid1 = purchase.shopid.toString();
            return shopid1 === shopid.substring(2);
        });
    }

    if (productid) {
        filteredPurchases = filteredPurchases.filter((purchase) => {
            const productid1 = purchase.productid.toString();
            return productid1 === productid.substring(2);
        });
    }

    if (sort) {
        if (sort === "QtyAsc") {
            filteredPurchases = filteredPurchases.sort((p1, p2) => p1.quantity - p2.quantity);
        } else if (sort === "QtyDesc") {
            filteredPurchases = filteredPurchases.sort((p1, p2) => p2.quantity - p1.quantity);
        } else if (sort === "ValueAsc") {
            filteredPurchases = filteredPurchases.sort((p1, p2) => p1.price * p1.quantity - p2.price * p2.quantity);
        } else if (sort === "ValueDesc") {
            filteredPurchases = filteredPurchases.sort((p1, p2) => p2.price * p2.quantity - p1.price * p1.quantity);
        }
    }

    res.send(filteredPurchases);
});



app.get("/purchases/shops/:id", function (req, res) {
    let id = +req.params.id;

    let shopPurchases = data.purchases.filter((ele) => ele.shopid === id);
    if (shopPurchases.length > 0) {
        res.send(shopPurchases);
    } else {
        res.status(404).send("No purchases found for the specified shop");
    }
})

app.get("/purchases/products/:id", function (req, res) {
    let id = +req.params.id;

    let productPurchases = data.purchases.filter((ele) => ele.productid === id);
    if (productPurchases.length > 0) {
        res.send(productPurchases);
    } else {
        res.status(404).send("No purchases found for the specified product");
    }
})

app.get("/totalpurchases/products/:id", function (req, res) {
    let id = +req.params.id;

    let productPurchases = data.purchases.filter((ele) => ele.productid === id);
    if (productPurchases.length > 0) {
        res.send(productPurchases);
    } else {
        res.status(404).send("No purchases found for the specified product");
    }
});

app.get("/totalpurchases/shops/:id", function (req, res) {
    let id = +req.params.id;
    let productPurchases = data.purchases.filter((ele) => ele.shopid === id);
    res.send(productPurchases);
});

app.post("/purchases", function (req, res) {
    let body = req.body;
    let maxId = data.purchases.reduce((acc, curr) => (curr.purchaseid >= acc ? curr.purchaseid : acc), 0);
    let newId = maxId + 1;
    let newProducts = { purchaseid: newId, ...body };
    data.purchases.push(newProducts);
    res.send(newProducts);
})
























