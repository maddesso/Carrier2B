const express = require('express');
//import { AxiosInstance } from "axios";

const axios = require('axios');

const app = express();
const port = 3000;
// const client = require("./client");

import { CarrierConnector } from "./carriers/CarrierConnector";
import { RoadieAdapter } from "./carriers/RoadieConnector";

const carrierConnnector: CarrierConnector = new CarrierConnector();
carrierConnnector.addAdapter(new RoadieAdapter());

app.use(express.json()) // for parsing application/json

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.get("/products", isAuthorized, (req, res) => {
    const products = [
        {
            id: 1,
            name: "hammer",
        },
        {
            id: 2,
            name: "screwdriver",
        },
        ,
        {
            id: 3,
            name: "wrench",
        },
    ];

    res.json(products);
});

app.post("/productPost", isAuthorized, (req, res) => {
    console.log("In product post: " + req.body);
    res.send("got productPost");
});

app.post("/getRate/:carrier", isAuthorized, async (req, res) => {
 
    console.log(req.params.carrier);
    carrierConnnector.getRate(req, res);

});

app.delete("/cancelShipment/:carrier/:deliveryId", isAuthorized, async (req, res) => {


    console.log(req.params.carrier);
    carrierConnnector.cancelShipment(req, res);

});


app.post("/bookShipment/:carrier", isAuthorized, async (req, res) => {


    console.log(req.params.carrier);
    carrierConnnector.bookShipment(req, res);

});


async function makeRequest() {
    var result = "error";

    const prom = await axios.get("http://localhost:3000/products", {
        headers: {
            authorization: 'secretpassword'
        }
    }).then(resp => {
        result = resp.data;
    }).catch(error => { console.log("my error " + error); });

    await prom;

    console.log(result);
}

function isAuthorized(req, res, next) {
    const auth = req.headers.authorization;
    if (auth === 'secretpassword') {
        next();
    } else {
        res.status(401);
        res.send('Not permitted');
    }
}