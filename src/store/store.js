import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import treeReducer from '../features/tree/treeSlice';
export const store = configureStore({
  reducer: {
    treeContainer: treeReducer,
  },
});
