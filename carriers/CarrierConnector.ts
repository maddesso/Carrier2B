// import { AxiosInstance } from "axios";


const axios = require('axios');

    export interface CarrierAdapter {
        createRateRequest: (orchRequest: any) => any;
        createRateResponse: (orchRequest: any, carrrierResponse: any) => any;
        getRateUrl: () => string;
        getCarrierName: () => string;
        getHeaders: () => any;
        getDeleteHeaders: () => any;
        createBookingRequest: (orchRequest: any) => any;
        createBookingResponse: (orchRequest: any, carrrierResponse: any) => any;
        getBookingUrl: () => string;
        getCancelUrl: (deliveryId: string) => string;
    }

  
export class CarrierConnector {
    carrierAdapters = {};

    addAdapter(adapter: CarrierAdapter): void {
        this.carrierAdapters[adapter.getCarrierName()] = adapter;
    }

    async getRate(req, res) {

        var result = "error";

        let connector: CarrierAdapter = this.carrierAdapters[req.params.carrier];
        if (connector == null) {
            res.send('Carrier: ' + req.params.carrier + ' not supported');
        }
        else {
            var rateRequest: any = connector.createRateRequest(req.body);
            console.log(rateRequest);

            let url = connector.getRateUrl();
            let cHeaders = connector.getHeaders();

            const prom = await axios.post(url, rateRequest, {
                headers: cHeaders
            }).then(resp => {
                let response = resp.data;
                result = connector.createRateResponse(req.body, response);
            }).catch(error => {
                console.log("my error " + error);
                console.log(error.response.data);
            });

            await prom;

            res.send(result);

        }
    }

    async bookShipment(req, res) {

        var result = "error";

        let connector: CarrierAdapter = this.carrierAdapters[req.params.carrier];
        if (connector == null) {
            res.send('Carrier: ' + req.params.carrier + ' not supported');
        }
        else {
            var bookRequest: any = connector.createBookingRequest(req.body);
            console.log(bookRequest);

            let url = connector.getBookingUrl();
            let cHeaders = connector.getHeaders();

            const prom = await axios.post(url, bookRequest, {
                headers: cHeaders
            }).then(resp => {
                let response = resp.data;
                result = connector.createBookingResponse(req.body, response);
            }).catch(error => {
                console.log("my error " + error);
                console.log(error.response.data);
            });

            await prom;

            res.send(result);

        }
    }

    async cancelShipment(req, res) {

        var result = "error";

        let connector: CarrierAdapter = this.carrierAdapters[req.params.carrier];
        if (connector == null) {
            res.send('Carrier: ' + req.params.carrier + ' not supported');
        }
        else {
            let url = connector.getCancelUrl(req.params.deliveryId);
            let cHeaders = connector.getDeleteHeaders();

            const prom = await axios.delete(url, {
                headers: cHeaders
            }).then(resp => {
                let response = resp.data;
                result = response;
            }).catch(error => {
                console.log("my error " + error);
                console.log(error.response.data);
            });

            await prom;

            res.send(result);

        }
    }

}
