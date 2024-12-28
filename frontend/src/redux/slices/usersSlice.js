import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../../utils/baseUrl";

// Async thunk to get users from the backend
export const getUsers = createAsyncThunk(
  "users/getUsers",
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { currentUser } = getState().auth; // Get currentUser from auth slice
      const token = currentUser?.token;

      const response = await axios.get(`${baseURL}/api/auth/get-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: userData,
        withCredentials: true,
      });

      return response.data; // Return the user data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Something went wrong"
      );
    }
  }
);

// Create slice to manage user state
const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [], // Default empty array for users
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload; // Store fetched users in the state
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Store error message in the state
      });
  },
});

export default usersSlice.reducer;
