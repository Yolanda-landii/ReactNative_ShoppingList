import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    editItem: (state, action) => {
      const { id, name, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.name = name;
        item.quantity = quantity;
      }
    },
    deleteItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setItems: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { addItem, editItem, deleteItem, setItems } = shoppingListSlice.actions;
export default shoppingListSlice.reducer;
