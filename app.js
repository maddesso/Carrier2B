"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
//import { AxiosInstance } from "axios";
const axios = require('axios');
const app = express();
const port = 3000;
// const client = require("./client");
const CarrierConnector_1 = require("./carriers/CarrierConnector");
const RoadieConnector_1 = require("./carriers/RoadieConnector");
const carrierConnnector = new CarrierConnector_1.CarrierConnector();
carrierConnnector.addAdapter(new RoadieConnector_1.RoadieAdapter());
app.use(express.json()); // for parsing application/json
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
app.post("/getRate/:carrier", isAuthorized, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.carrier);
    carrierConnnector.getRate(req, res);
}));
app.delete("/cancelShipment/:carrier/:deliveryId", isAuthorized, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.carrier);
    carrierConnnector.cancelShipment(req, res);
}));
app.post("/bookShipment/:carrier", isAuthorized, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.carrier);
    carrierConnnector.bookShipment(req, res);
}));
function makeRequest() {
    return __awaiter(this, void 0, void 0, function* () {
        var result = "error";
        const prom = yield axios.get("http://localhost:3000/products", {
            headers: {
                authorization: 'secretpassword'
            }
        }).then(resp => {
            result = resp.data;
        }).catch(error => { console.log("my error " + error); });
        yield prom;
        console.log(result);
    });
}
function isAuthorized(req, res, next) {
    const auth = req.headers.authorization;
    if (auth === 'secretpassword') {
        next();
    }
    else {
        res.status(401);
        res.send('Not permitted');
    }
}
//# sourceMappingURL=app.js.map