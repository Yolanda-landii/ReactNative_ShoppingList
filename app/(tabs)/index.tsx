import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addItem, editItem, deleteItem, setItems } from '../../Redux/shoppingListSlice';
import store from '../../Redux/Store';

const ShoppingList = () => {
  const dispatch = useDispatch();
  const items = useSelector(state => state.shoppingList.items);

  const [newItem, setNewItem] = React.useState('');
  const [newQuantity, setNewQuantity] = React.useState('');
  const [editingItemId, setEditingItemId] = React.useState(null);

  useEffect(() => {
    const loadItems = async () => {
      const savedItems = await AsyncStorage.getItem('shoppingList');
      if (savedItems) {
        dispatch(setItems(JSON.parse(savedItems)));
      }
    };
    loadItems();
  }, [dispatch]);

  useEffect(() => {
    AsyncStorage.setItem('shoppingList', JSON.stringify(items));
  }, [items]);

  const handleAddItem = () => {
    if (!newItem.trim() || !newQuantity.trim()) return;
    const item = { id: Date.now().toString(), name: newItem, quantity: newQuantity, purchased: false };
    dispatch(addItem(item));
    setNewItem('');
    setNewQuantity('');
  };

  const handleEditItem = (item) => {
    setEditingItemId(item.id);
    setNewItem(item.name);
    setNewQuantity(item.quantity);
  };

  const handleSaveEdit = () => {
    dispatch(editItem({ id: editingItemId, name: newItem, quantity: newQuantity }));
    setEditingItemId(null);
    setNewItem('');
    setNewQuantity('');
  };

  const handleDeleteItem = (id) => {
    dispatch(deleteItem(id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shopping List</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.name} - {item.quantity}</Text>
            <View style={styles.buttons}>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEditItem(item)}>
                <Text>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteItem(item.id)}>
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Item Name"
          value={newItem}
          onChangeText={setNewItem}
        />
        <TextInput
          style={styles.input}
          placeholder="Quantity"
          value={newQuantity}
          onChangeText={setNewQuantity}
        />
        {editingItemId ? (
          <TouchableOpacity style={styles.addButton} onPress={handleSaveEdit}>
            <Text>Save</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
            <Text>Add</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const App = () => (
  <Provider store={store}>
    <ShoppingList />
  </Provider>
);

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  itemText: {
    fontSize: 16,
  },
  buttons: {
    flexDirection: 'row',
  },
  editButton: {
    marginRight: 10,
    padding: 5,
    backgroundColor: '#ffd700',
    borderRadius: 5,
  },
  deleteButton: {
    padding: 5,
    backgroundColor: '#ff6347',
    borderRadius: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#32cd32',
    padding: 10,
    borderRadius: 5,
  },
});
