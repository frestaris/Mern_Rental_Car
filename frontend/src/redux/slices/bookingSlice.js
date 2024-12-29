import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../../utils/baseUrl";

// Async actions
export const fetchBookings = createAsyncThunk(
  "booking/fetchBookings",
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const response = await axios.get(`${baseURL}/api/booking/get-bookings`, {
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
    booking: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Bookings
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
        state.error = null;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { resetError } = bookingSlice.actions;

export default bookingSlice.reducer;
