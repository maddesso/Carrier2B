"use strict";
// import { AxiosInstance } from "axios";
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
exports.CarrierConnector = void 0;
const axios = require('axios');
class CarrierConnector {
    constructor() {
        this.carrierAdapters = {};
    }
    addAdapter(adapter) {
        this.carrierAdapters[adapter.getCarrierName()] = adapter;
    }
    getRate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var result = "error";
            let connector = this.carrierAdapters[req.params.carrier];
            if (connector == null) {
                res.send('Carrier: ' + req.params.carrier + ' not supported');
            }
            else {
                var rateRequest = connector.createRateRequest(req.body);
                console.log(rateRequest);
                let url = connector.getRateUrl();
                let cHeaders = connector.getHeaders();
                const prom = yield axios.post(url, rateRequest, {
                    headers: cHeaders
                }).then(resp => {
                    let response = resp.data;
                    result = connector.createRateResponse(req.body, response);
                }).catch(error => {
                    console.log("my error " + error);
                    console.log(error.response.data);
                });
                yield prom;
                res.send(result);
            }
        });
    }
    bookShipment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var result = "error";
            let connector = this.carrierAdapters[req.params.carrier];
            if (connector == null) {
                res.send('Carrier: ' + req.params.carrier + ' not supported');
            }
            else {
                var bookRequest = connector.createBookingRequest(req.body);
                console.log(bookRequest);
                let url = connector.getBookingUrl();
                let cHeaders = connector.getHeaders();
                const prom = yield axios.post(url, bookRequest, {
                    headers: cHeaders
                }).then(resp => {
                    let response = resp.data;
                    result = connector.createBookingResponse(req.body, response);
                }).catch(error => {
                    console.log("my error " + error);
                    console.log(error.response.data);
                });
                yield prom;
                res.send(result);
            }
        });
    }
    cancelShipment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var result = "error";
            let connector = this.carrierAdapters[req.params.carrier];
            if (connector == null) {
                res.send('Carrier: ' + req.params.carrier + ' not supported');
            }
            else {
                let url = connector.getCancelUrl(req.params.deliveryId);
                let cHeaders = connector.getDeleteHeaders();
                const prom = yield axios.delete(url, {
                    headers: cHeaders
                }).then(resp => {
                    let response = resp.data;
                    result = response;
                }).catch(error => {
                    console.log("my error " + error);
                    console.log(error.response.data);
                });
                yield prom;
                res.send(result);
            }
        });
    }
}
exports.CarrierConnector = CarrierConnector;
//# sourceMappingURL=CarrierConnector.js.map