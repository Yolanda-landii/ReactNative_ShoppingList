import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TextInput, TouchableOpacity, FlatList, Picker, StyleSheet } from 'react-native';
import { addList, addItemToList, toggleItemPurchased, deleteItemFromList, loadShoppingLists,editListName, editItemDetails, deleteList} from '../../Redux/shoppingListSlice';

const ShoppingList = () => {
  const dispatch = useDispatch();
  const lists = useSelector((state) => state.shoppingList.lists);

  const [newList, setNewList] = useState('');
  const [newItem, setNewItem] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [selectedListId, setSelectedListId] = useState('');

  // Load shopping lists from AsyncStorage on component mount
  useEffect(() => {
    dispatch(loadShoppingLists());
  }, [dispatch]);

  const handleAddList = () => {
    if (!newList.trim()) return alert('List name cannot be empty.');
    dispatch(addList(newList));
    setNewList('');
  };

  const handleAddItem = () => {
    if (!newItem.trim() || !newQuantity.trim() || !selectedListId) {
      return alert('Provide all fields and select a list.');
    }
    const list = lists.find((list) => list.id === selectedListId);
    if (list && list.items.find((item) => item.name === newItem.trim())) {
      return alert('Item already exists in the list.');
    }
    const item = { id: Date.now().toString(), name: newItem, quantity: newQuantity, purchased: false };
    dispatch(addItemToList({ listId: selectedListId, item }));
    setNewItem('');
    setNewQuantity('');
  };
  const handleEditListName = (listId, newName) => {
    dispatch(editListName({ listId, newName }));
  };

  const handleDeleteList = (listId) => {
    dispatch(deleteList(listId));
  };

  const togglePurchased = (listId, itemId) => {
    dispatch(toggleItemPurchased({ listId, itemId }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shopping Lists</Text>
      <FlatList
        data={lists}
        keyExtractor={(list) => list.id}
        renderItem={({ item: list }) => (
          <View style={styles.listContainer}>
            <View style={styles.listHeaderContainer}>
              <TextInput
                style={styles.listHeader}
                value={list.name}
                onChangeText={(text) => handleEditListName(list.id, text)}
              />
              <TouchableOpacity onPress={() => handleDeleteList(list.id)}>
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={list.items}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ShoppingItem
                  item={item}
                  listId={list.id}
                  togglePurchased={() => togglePurchased(list.id, item.id)}
                  deleteItem={() => dispatch(deleteItemFromList({ listId: list.id, itemId: item.id }))}
                  editItem={(newName, newQuantity) =>
                    dispatch(editItemDetails({ listId: list.id, itemId: item.id, newName, newQuantity }))
                  }
                />
              )}
            />
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="List Name"
          value={newList}
          onChangeText={setNewList}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddList}>
          <Text style={styles.addButtonText}>Add List</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <Picker
          selectedValue={selectedListId}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedListId(itemValue)}
        >
          <Picker.Item label="Select a List" value="" />
          {lists.map((list) => (
            <Picker.Item key={list.id} label={list.name} value={list.id} />
          ))}
        </Picker>
        <TextInput
          style={styles.itemInput}
          placeholder="Item Name"
          value={newItem}
          onChangeText={setNewItem}
        />
        <TextInput
          style={styles.quantityInput}
          placeholder="Quantity"
          value={newQuantity}
          onChangeText={setNewQuantity}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
          <Text style={styles.addButtonText}>Add Item</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const ShoppingItem = ({ item, listId, togglePurchased, deleteItem, editItem }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(item.name);
  const [newQuantity, setNewQuantity] = useState(item.quantity);

  const handleSave = () => {
    editItem(newName, newQuantity);
    setIsEditing(false);
  };

  return (
    <View style={styles.item}>
      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.itemInput}
            value={newName}
            onChangeText={setNewName}
          />
          <TextInput
            style={styles.quantityInput}
            value={newQuantity}
            onChangeText={setNewQuantity}
            keyboardType="numeric"
          />
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <TouchableOpacity onPress={togglePurchased}>
            <Text style={[styles.itemText, item.purchased && styles.purchased]}>
              {item.purchased ? '✅' : '⬜'} {item.name} - {item.quantity}
            </Text>
          </TouchableOpacity>
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={deleteItem}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default ShoppingList;

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
    textAlign: 'center',
  },
  listContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemText: {
    fontSize: 16,
  },
  deleteButton: {
    color: '#ff6347',
  },
  purchased: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  picker: {
    flex: 1,
    marginBottom: 10,
  },
  itemInput: {
    flex: 3,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginRight: 5,
  },
  quantityInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginRight: 5,
  },
  addButton: {
    backgroundColor: '#32cd32',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButton: {
    color: '#32cd32',
    marginLeft: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editButton: {
    color: '#1e90ff',
    marginRight: 10,
  },
  
});
