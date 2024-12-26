import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async actions
export const fetchBookings = createAsyncThunk(
  "booking/fetchBookings",
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const response = await axios.get("/api/bookings", {
        headers: { Authorization: `Bearer ${auth.user.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (bookingData, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const response = await axios.post("/api/bookings", bookingData, {
        headers: { Authorization: `Bearer ${auth.user.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    bookings: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
        state.error = null;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.bookings.push(action.payload);
        state.error = null;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default bookingSlice.reducer;
