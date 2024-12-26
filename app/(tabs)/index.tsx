// import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from '../../Redux/Store'; // Ensure this import is correct
import ShoppingList from './shoppingList';
// import { loadShoppingLists } from '../../Redux/shoppingListSlice';

const App = () => {
  return (
    <Provider store={store}>
      <ShoppingList />
    </Provider>
  );
};

export default App;
