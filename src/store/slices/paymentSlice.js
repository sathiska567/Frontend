import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import paymentService from "../../services/paymentService";

const initialState = {
    isLoading: false,
    error: null,
    paymentSuccess: false,
    sessionExpired: false,
}

export const createPayment = createAsyncThunk(
    "payment/create",
    async (paymentData, { rejectWithValue }) => {
        try {
            const response = await paymentService.createPayment(paymentData);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Payment failed"
            );
        }
    }
);

const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {
        resetPaymentState: (state) => {
            state.error = null;
            state.isLoading = false;
            state.sessionExpired = false;
        },
        clearPaymentSuccess: (state) => {
            state.paymentSuccess = false;
        },
        setSessionExpired: (state, action) => {
            state.sessionExpired = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPayment.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createPayment.fulfilled, (state) => {
                state.isLoading = false;
                state.paymentSuccess = true;
            })
            .addCase(createPayment.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { resetPaymentState, clearPaymentSuccess, setSessionExpired } = paymentSlice.actions;

export default paymentSlice.reducer;