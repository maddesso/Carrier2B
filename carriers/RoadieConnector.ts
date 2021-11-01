
import { CarrierAdapter } from "./CarrierConnector";


export class RoadieAdapter implements CarrierAdapter {
/*        getRate(orchRequest: any): any {
            var roadieRequest: any = this.createRoadieRate(orchRequest);

//            axios.get("http://localhost:3000/products").then(resp => {
//                console.log(resp.data);
//            });


            return roadieRequest;
        }
        */

    getCarrierName(): string {
        return "Roadie";
    }


    bookShipment(orchRequest: any): any {
        return 'shipment not booked';
    }

    getRateUrl(): string {
        return "https://connect-sandbox.roadie.com/v1/estimates";
    }

    getBookingUrl(): string {
        return "https://connect-sandbox.roadie.com/v1/shipments";
    }

    getCancelUrl(deliveryId: string): string {
        return "https://connect-sandbox.roadie.com/v1/shipments/" + deliveryId;
    }

    getHeaders(): any {
        return {
            "Authorization": 'Bearer 7b05426cf9158ec7b3cf2d975fd63176e9637152',
            "Content-Type": "application/json"
        };
    }
    getDeleteHeaders(): any {
        return {
            "Authorization": 'Bearer 7b05426cf9158ec7b3cf2d975fd63176e9637152'
        };
    }

    createRateResponse(orchRequest: any, carrierResponse: any): any {
        var orchResponse: any = {};

        orchResponse.quoteId = orchRequest.id;
        orchResponse.carrier = 'ROADIE';
        orchResponse.totalFee = { amount: carrierResponse.price, currency: 'USD', symbol: '$' };
        orchResponse.deliveryFee = { amount: carrierResponse.price, currency: 'USD', symbol: '$' };
        orchResponse.tip = { amount: 0, currency: 'USD', symbol: '$' };
        orchResponse.loadingFee = { amount: 0, currency: 'USD', symbol: '$' };


        console.log(JSON.stringify(orchResponse));
        return orchResponse;

    }

    createRateRequest(orchJSON: any) : any {
        var rate: any = {};
        rate.items = [];

        for (let orchItem of orchJSON.lineItems) {
            var item: any = {};
            item.length = orchItem.parts[0].dimensions.length;
            item.width = orchItem.parts[0].dimensions.breadth;
            item.height = orchItem.parts[0].dimensions.height;
            item.weight = orchItem.parts[0].weight.value;
            item.quantity = orchItem.quantity;
            item.value = orchItem.price.amount;
            item.description = orchItem.name;
            rate.items.push(item);
        }

        rate.pickup_location = this.createAddress(orchJSON.pickupLocationAddress);
        rate.delivery_location = this.createAddress(orchJSON.dropLocationAddress);

        rate.pickup_after = orchJSON.pickupSlot.start;
        rate.deliver_between = { start: orchJSON.dropSlot.start, end: orchJSON.dropSlot.end };

        console.log(JSON.stringify(rate));
        return rate;

    }

    createBookingRequest(orchRequest: any): any {
        // booking request is same as rate request
        var booking = this.createRateRequest(orchRequest);
        booking.reference_id = orchRequest.id;
        booking.options = {
            signature_required: true,
            notifications_enabled: false,
            over_21_required: false,
            extra_compensation: 0.0
        }

        booking.delivery_location.contact = {
            name: orchRequest.dropContactPoint.name,
            phone: orchRequest.dropContactPoint.number
        }

        booking.pickup_location.contact = {
            name: orchRequest.pickupContactPoint.name,
            phone: orchRequest.dropContactPoint.number
        }


        let bookingString: string = JSON.stringify(booking);
        console.log(bookingString);
        return booking;
    }

    createBookingResponse(orchRequest: any, carrierResponse: any): any {
        var orchResponse = this.createRateResponse(orchRequest, carrierResponse);
        orchResponse.carrierQuoteId = carrierResponse.id;

        return orchResponse;
    }

    createAddress(oAddr: any) : any {
        var addr: any = {};
        addr.street1 = oAddr.formattedAddress;

        addr.city = oAddr.city;
        addr.state = oAddr.state;
        addr.zip = oAddr.pincode;

        return { "address": addr };

    }

}


