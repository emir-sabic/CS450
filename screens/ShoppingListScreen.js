// screens/ShoppingListScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const ShoppingListScreen = () => {
  const [shoppingList, setShoppingList] = useState([]);

  const getShoppingList = async () => {
    try {
      const shoppingList = await AsyncStorage.getItem('shoppingList');
      if (shoppingList !== null) {
        setShoppingList(JSON.parse(shoppingList));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getShoppingList();
    }, [])
  );

  const removeIngredient = async (ingredient) => {
    try {
      let shoppingList = await AsyncStorage.getItem('shoppingList');
      if (shoppingList !== null) {
        shoppingList = JSON.parse(shoppingList);
        shoppingList = shoppingList.filter(item => item !== ingredient);
        await AsyncStorage.setItem('shoppingList', JSON.stringify(shoppingList));
        setShoppingList(shoppingList);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeAllIngredients = async () => {
    try {
      await AsyncStorage.removeItem('shoppingList');
      setShoppingList([]);
    } catch (error) {
      console.error(error);
    }
  };

  const confirmRemoveAllIngredients = () => {
    Alert.alert(
      "Remove All Ingredients",
      "Are you sure you want to remove all ingredients?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: removeAllIngredients }
      ]
    );
  };

  const stripMeasurement = (ingredient) => {
    return ingredient.replace(/^\d*\/?\d*\s*(cup|tablespoon|teaspoon|tbsp|tsp|g|cloves?|ml|oz|lb|kg|fl oz|pint|quart|liter|litre|s|a)?\s*/i, '').trim();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={confirmRemoveAllIngredients}>
        <Text style={styles.buttonText}>Remove All</Text>
      </TouchableOpacity>
      <FlatList
        data={shoppingList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemText}>{stripMeasurement(item)}</Text>
            </View>
            <TouchableOpacity style={[styles.button, styles.removeButton]} onPress={() => removeIngredient(item)}>
              <Text style={styles.buttonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#0288D1',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: '#d32f2f',
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  itemTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  itemText: {
    fontSize: 16,
    color: '#555',
  },
});

export default ShoppingListScreen;
