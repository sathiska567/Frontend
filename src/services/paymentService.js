import { paymentApi } from "./api";

const paymentService = {
    createPayment: async (paymentData) => {
        console.log("paymentData", paymentData);
        
        const response = await paymentApi.post("/create_payment", paymentData);
        console.log("response", response);
        return response.data;
    }
}

export default paymentService;
