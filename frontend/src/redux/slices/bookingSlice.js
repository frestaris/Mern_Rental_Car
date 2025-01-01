import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../../utils/baseUrl";

// Delete a booking by ID
export const deleteBooking = createAsyncThunk(
  "bookings/deleteBooking",
  async (bookingId, { getState, rejectWithValue }) => {
    try {
      const { currentUser } = getState().auth;
      const token = currentUser?.token;

      if (!token) {
        return rejectWithValue("No token, please login first.");
      }

      await axios.delete(`${baseURL}/api/booking/delete/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      return bookingId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting booking");
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
      // Delete booking
      .addCase(deleteBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = state.bookings.filter(
          (booking) => booking._id !== action.payload
        );
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete booking";
      });
  },
});

export const { resetError } = bookingsSlice.actions;

export default bookingsSlice.reducer;
