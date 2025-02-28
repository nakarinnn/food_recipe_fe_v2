import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: number | null;
  name: string;
  email: string;
  avatar_url: string;
  isLoggedIn: boolean; // Add a isLoggedIn flag
}

const initialState: UserState = {
  id: null,
  name: '',
  email: '',
  avatar_url: '',
  isLoggedIn: false, // Initially, the user is not logged in
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.avatar_url = action.payload.avatar_url;
      state.isLoggedIn = true; // Set isLoggedIn to true upon login
    },
    clearUser: (state) => {
      state.id = null;
      state.name = '';
      state.email = '';
      state.avatar_url = '';
      state.isLoggedIn = false; // Set isLoggedIn to false upon logout
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
