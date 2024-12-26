import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveToStorage = async (lists) => {
  try {
    await AsyncStorage.setItem('@shopping_lists', JSON.stringify(lists));
  } catch (e) {
    console.error("Error saving data", e);
  }
};

const loadFromStorage = async () => {
  try {
    const data = await AsyncStorage.getItem('@shopping_lists');
    return data != null ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error loading data", e);
    return [];
  }
};


const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState: {
    lists: [],
  },
  reducers: {
    setLists: (state, action) => {
      state.lists = action.payload;
    },
    addList: (state, action) => {
      const newList = { id: Date.now().toString(), name: action.payload, items: [] };
      state.lists.push(newList);
      saveToStorage(state.lists);
    },
    addItemToList: (state, action) => {
      const { listId, item } = action.payload;
      const list = state.lists.find((list) => list.id === listId);
      if (list) {
        list.items.push(item);
        saveToStorage(state.lists);
      }
    },
    toggleItemPurchased: (state, action) => {
      const { listId, itemId } = action.payload;
      const list = state.lists.find((list) => list.id === listId);
      if (list) {
        const item = list.items.find((item) => item.id === itemId);
        if (item) {
          item.purchased = !item.purchased;
          saveToStorage(state.lists);
        }
      }
    },
    deleteItemFromList: (state, action) => {
      const { listId, itemId } = action.payload;
      const list = state.lists.find((list) => list.id === listId);
      if (list) {
        list.items = list.items.filter((item) => item.id !== itemId);
        saveToStorage(state.lists);
      }
    },
    editListName: (state, action) => {
      const { listId, newName } = action.payload;
      const list = state.lists.find((list) => list.id === listId);
      if (list) {
        list.name = newName;
        saveToStorage(state.lists);
      }
    },
    editItemDetails: (state, action) => {
      const { listId, itemId, newName, newQuantity } = action.payload;
      const list = state.lists.find((list) => list.id === listId);
      if (list) {
        const item = list.items.find((item) => item.id === itemId);
        if (item) {
          item.name = newName;
          item.quantity = newQuantity;
          saveToStorage(state.lists);
        }
      }
    },
    deleteList: (state, action) => {
      state.lists = state.lists.filter((list) => list.id !== action.payload);
      saveToStorage(state.lists);
    },
    
  },
});

export const loadShoppingLists = () => async (dispatch) => {
  const lists = await loadFromStorage();
  dispatch(setLists(lists));
};

export const { setLists, addList, addItemToList, toggleItemPurchased, deleteItemFromList,editListName, editItemDetails, deleteList } = shoppingListSlice.actions;

export default shoppingListSlice.reducer;
