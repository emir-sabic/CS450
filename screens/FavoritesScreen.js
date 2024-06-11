// screens/FavoritesScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);

  const getFavorites = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      if (favorites !== null) {
        setFavorites(JSON.parse(favorites));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getFavorites();
    }, [])
  );

  const removeFavorite = async (uri) => {
    try {
      let favorites = await AsyncStorage.getItem('favorites');
      if (favorites !== null) {
        favorites = JSON.parse(favorites);
        favorites = favorites.filter(fav => fav.uri !== uri);
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
        setFavorites(favorites);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeAllFavorites = async () => {
    try {
      await AsyncStorage.removeItem('favorites');
      setFavorites([]);
    } catch (error) {
      console.error(error);
    }
  };

  const confirmRemoveAllFavorites = () => {
    Alert.alert(
      "Remove All Favorites",
      "Are you sure you want to remove all favorites?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: removeAllFavorites }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={confirmRemoveAllFavorites}>
        <Text style={styles.buttonText}>Remove All</Text>
      </TouchableOpacity>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.uri}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity style={styles.itemTextContainer} onPress={() => navigation.navigate('RecipeDetails', { recipe: item })}>
              <Text style={styles.itemText}>{item.label}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.removeButton]} onPress={() => removeFavorite(item.uri)}>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default FavoritesScreen;
