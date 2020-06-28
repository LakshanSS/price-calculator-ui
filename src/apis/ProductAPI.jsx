import Axios from 'axios';

export class ProductAPI {
    static getHTTPClient() {
        let httpClient = Axios.create({
            baseURL: "http://localhost:8080",
            timeout: 12000

        });
        return httpClient;
    };

    static getPrice(id, singleUnits, cartons, isTable) {
        return ProductAPI.getHTTPClient().get('/calculatePrice?id=' + id + '&singleUnits=' + singleUnits + '&cartons='
        + cartons + '&isTable=' + isTable);
    }

    static getItems() {
        return ProductAPI.getHTTPClient().get('/items');
    }

}