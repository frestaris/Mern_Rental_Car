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

export const getCars = createAsyncThunk(
  "vehicles/getCars",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseURL}/api/car/get-cars`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch cars"
      );
    }
  }
);

export const deleteCar = createAsyncThunk(
  "vehicles/deleteCar",
  async (carId, { getState, rejectWithValue }) => {
    try {
      const { currentUser } = getState().auth;
      const token = currentUser?.token;

      await axios.delete(`${baseURL}/api/car/delete-car/${carId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      return carId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete car"
      );
    }
  }
);
// Vehicles slice
const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState: {
    vehicles: [],
    status: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle adding a vehicle
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
      })
      // Handle fetching cars
      .addCase(getCars.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCars.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.vehicles = action.payload;
      })
      .addCase(getCars.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Handle deleting a car
      .addCase(deleteCar.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCar.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.vehicles = state.vehicles.filter(
          (car) => car._id !== action.payload
        );
      })
      .addCase(deleteCar.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default vehiclesSlice.reducer;
