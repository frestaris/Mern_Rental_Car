import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../../utils/baseUrl";

export const addVehicle = createAsyncThunk(
  "vehicles/addVehicle",
  async (vehicleData, { getState, rejectWithValue }) => {
    try {
      const { currentUser } = getState().auth;
      const token = currentUser?.token;

      const response = await axios.post(
        `${baseURL}/api/car/add-car`,
        vehicleData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Something went wrong"
      );
    }
  }
);

// Vehicles slice
const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState: {
    vehicles: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addVehicle.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addVehicle.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.vehicles.push(action.payload);
      })
      .addCase(addVehicle.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default vehiclesSlice.reducer;
