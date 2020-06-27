import Axios from 'axios';

export class ProductAPI {
    static getHTTPClient() {
        let httpClient = Axios.create({
            baseURL: "http://localhost:8080",
            timeout: 12000

        });
        return httpClient;
    };

    static getResult() {
        return ProductAPI.getHTTPClient().get('/calculatePrice?id=1&quantity=60' );
    }
}