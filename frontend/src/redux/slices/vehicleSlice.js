import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../../utils/baseUrl";

// Add Vehicle
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
      console.error("Error response:", error.response);
      return rejectWithValue(
        error.response?.data?.error || "Something went wrong"
      );
    }
  }
);

// Get Cars
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

// Get Car by ID
export const getCarById = createAsyncThunk(
  "vehicles/getCarById",
  async (carId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseURL}/api/car/get-car/${carId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch car"
      );
    }
  }
);

// Update Vehicle
export const updateVehicle = createAsyncThunk(
  "vehicles/updateVehicle",
  async ({ id, vehicleData }, { getState, rejectWithValue }) => {
    try {
      const { currentUser } = getState().auth;
      const token = currentUser?.token;

      const response = await axios.put(
        `${baseURL}/api/car/update-car/${id}`,
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
        error.response?.data?.error || "Failed to update vehicle"
      );
    }
  }
);

// Delete Vehicle
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

// Get Available Vehicles
export const getAvailableVehicles = createAsyncThunk(
  "vehicles/getAvailableVehicles",
  async ({ pickupDate, dropoffDate }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${baseURL}/api/booking/available-vehicles`,
        {
          params: { pickupDate, dropoffDate },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Vehicles slice
const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState: {
    vehicles: [],
    currentCar: null,
    availableVehicles: [],
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
      // Handle getting car by ID
      .addCase(getCarById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCarById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentCar = action.payload;
      })
      .addCase(getCarById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Handle updating a vehicle
      .addCase(updateVehicle.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateVehicle.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedCar = action.payload;
        state.vehicles = state.vehicles.map((car) =>
          car._id === updatedCar._id ? updatedCar : car
        );
      })
      .addCase(updateVehicle.rejected, (state, action) => {
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
      })
      // Fetch Available Vehicles
      .addCase(getAvailableVehicles.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAvailableVehicles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.availableVehicles = action.payload;
      })
      .addCase(getAvailableVehicles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default vehiclesSlice.reducer;
