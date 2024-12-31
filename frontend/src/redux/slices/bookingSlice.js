import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../../utils/baseUrl";

export const fetchBookingsByUser = createAsyncThunk(
  "bookings/fetchByUser",
  async (userId, thunkAPI) => {
    try {
      const response = await axios.get(`${baseURL}/api/booking/user/${userId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data || "Error fetching bookings"
      );
    }
  }
);

const bookingsSlice = createSlice({
  name: "bookings",
  initialState: {
    bookings: [],
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
      .addCase(fetchBookingsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookingsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch bookings";
      });
  },
});

export const { resetError } = bookingsSlice.actions;

export default bookingsSlice.reducer;
