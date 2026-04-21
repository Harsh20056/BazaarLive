import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'Buyer' | 'Vendor';

export interface UserState {
  isLoggedIn: boolean;
  userRole: UserRole | null;
  isGoldMember: boolean;
  name: string;
  email: string;
  shopId: string | null;
  avatar: string;
}

const initialState: UserState = {
  isLoggedIn: false,
  userRole: null,
  isGoldMember: false,
  name: '',
  email: '',
  shopId: null,
  avatar: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginAs: (state, action: PayloadAction<{
      role: UserRole;
      name: string;
      email: string;
      isGoldMember?: boolean;
      shopId?: string;
      avatar?: string;
    }>) => {
      state.isLoggedIn = true;
      state.userRole = action.payload.role;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.isGoldMember = action.payload.isGoldMember ?? false;
      state.shopId = action.payload.shopId ?? null;
      state.avatar = action.payload.avatar ?? '';
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userRole = null;
      state.isGoldMember = false;
      state.name = '';
      state.email = '';
      state.shopId = null;
      state.avatar = '';
    },
    upgradeToGold: (state) => {
      state.isGoldMember = true;
    },
  },
});

export const { loginAs, logout, upgradeToGold } = userSlice.actions;
export default userSlice.reducer;
