import React, { Children } from 'react';
import { useDispatch } from 'react-redux';
import { createSlice } from '@reduxjs/toolkit';
import treeData from '../../data.json';
import { v4 as uuidv4 } from 'uuid';
import { SignalWifiStatusbar4Bar } from '@mui/icons-material';
const initialState = {
  treeData: treeData,
};

const treeSlice = createSlice({
  name: 'tree',
  initialState,
  reducers: {
    importJsonData: (state, { payload }) => {
      state.treeData = payload;
    },

    selectNode: (state, action) => {
      console.log('node', action);
      // state.treeData = state.payload;
    },
    removeTreeFolder: (state, { payload }) => {
      console.log('payload', payload);
    },

    addNewFolder: (state, { payload }) => {
      if (payload.node.id === undefined) {
        state.treeData.children.push({
          id: uuidv4(),
          name: `New folder ${state.treeData.children.length + 1}`,
          children: [],
        });
        return;
      }
      const addFolder = (data) => {
        for (let i of data) {
          if (i.children === undefined) {
            console.log('i.', i.children);
          }
          if (
            i.id === payload.node.id &&
            i.children !== undefined &&
            payload.node.id !== undefined
          ) {
            i.children.push({
              id: uuidv4(),
              name: `New folder ${i.children.length + 1}`,
              children: [],
              parentId: payload.node.id,
            });
          } else if (i.children !== undefined) {
            addFolder(i.children);
          }
        }
      };
      addFolder([state.treeData]);
    },
    editNodeDAta: (state, { payload }) => {
      const addFolder = (data) => {
        for (let i of data) {
          if (i.id === payload.id && i.children !== undefined) {
            i.name = `${payload.name} `;
            i.spouse = payload.spouse;
            i.location = payload.location;
            i.birthYear = payload.birthYear;
            i.presentAddress = payload.presentAddress;
          } else if (i.children !== undefined) {
            addFolder(i.children);
          }
        }
      };
      addFolder([state.treeData]);
    },
    treeSearchHandler: (state, { payload }) => {
      const { filterData, text } = payload;
      console.log('payload', filterData);
      if (text) {
        // console.log('payload', filterData);
        // state.treeData = filterData;
      }
      // if (payload.text.length > 0) {
      //   state.treeData = payload.filterData;
      // } else {
      //   state.treeData = initialState;
      // }
    },
  },
});

// console.log(treeSlice);
export const {
  importJsonData,
  selectNode,
  addNewFolder,
  editNodeDAta,
  removeTreeFolder,
  treeSearchHandler,
} = treeSlice.actions;
export default treeSlice.reducer;
