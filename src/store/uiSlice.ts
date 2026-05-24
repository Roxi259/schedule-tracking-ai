/**
 * UI Redux Slice
 * Manages UI state
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  isLoading: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  showModal: boolean;
  modalType: 'create' | 'edit' | 'delete' | 'reminder' | null;
  selectedItemId: string | null;
}

const initialState: UIState = {
  isLoading: false,
  errorMessage: null,
  successMessage: null,
  showModal: false,
  modalType: null,
  selectedItemId: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setErrorMessage: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload;
    },
    setSuccessMessage: (state, action: PayloadAction<string | null>) => {
      state.successMessage = action.payload;
    },
    clearMessages: (state) => {
      state.errorMessage = null;
      state.successMessage = null;
    },
    openModal: (
      state,
      action: PayloadAction<{ type: 'create' | 'edit' | 'delete' | 'reminder'; itemId?: string }>,
    ) => {
      state.showModal = true;
      state.modalType = action.payload.type;
      state.selectedItemId = action.payload.itemId || null;
    },
    closeModal: (state) => {
      state.showModal = false;
      state.modalType = null;
      state.selectedItemId = null;
    },
  },
});

export const {
  setLoading,
  setErrorMessage,
  setSuccessMessage,
  clearMessages,
  openModal,
  closeModal,
} = uiSlice.actions;

export default uiSlice.reducer;