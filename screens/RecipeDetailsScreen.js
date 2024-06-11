// screens/RecipeDetailsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';

const RecipeDetailsScreen = ({ route }) => {
  const { recipe } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [showWebView, setShowWebView] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const favorites = await AsyncStorage.getItem('favorites');
        if (favorites !== null) {
          const parsedFavorites = JSON.parse(favorites);
          if (parsedFavorites.some(fav => fav.uri === recipe.uri)) {
            setIsFavorite(true);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkFavorite();
  }, []);

  const toggleFavorite = async () => {
    try {
      let favorites = await AsyncStorage.getItem('favorites');
      if (favorites === null) {
        favorites = [];
      } else {
        favorites = JSON.parse(favorites);
      }

      if (isFavorite) {
        favorites = favorites.filter(fav => fav.uri !== recipe.uri);
      } else {
        favorites.push(recipe);
      }

      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error(error);
    }
  };

  const addToShoppingList = async (ingredients) => {
    try {
      let shoppingList = await AsyncStorage.getItem('shoppingList');
      if (shoppingList === null) {
        shoppingList = [];
      } else {
        shoppingList = JSON.parse(shoppingList);
      }

      ingredients.forEach(ingredient => {
        const strippedIngredient = stripMeasurement(ingredient);
        if (!shoppingList.includes(strippedIngredient)) {
          shoppingList.push(strippedIngredient);
        }
      });

      await AsyncStorage.setItem('shoppingList', JSON.stringify(shoppingList));
      alert('Ingredients added to shopping list!');
    } catch (error) {
      console.error(error);
    }
  };

  const stripMeasurement = (ingredient) => {
    return ingredient.replace(/^\d*\/?\d*\s*(cup|tablespoon|teaspoon|tbsp|tsp|g|cloves?|ml|oz|lb|kg|fl oz|pint|quart|liter|litre|s|a)?\s*/i, '').trim();
  };

  if (showWebView) {
    return (
      <WebView
        source={{ uri: recipe.url }}
        style={{ flex: 1 }}
        startInLoadingState
        scalesPageToFit
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{recipe.label}</Text>
      {recipe.image && <Image source={{ uri: recipe.image }} style={styles.image} />}
      {recipe.yield && (
        <Text style={styles.subtitle}>Serves: {recipe.yield}</Text>
      )}
      <Text style={styles.subtitle}>Ingredients:</Text>
      {recipe.ingredientLines.map((item, index) => (
        <Text key={index} style={styles.ingredient}>{item}</Text>
      ))}
      <TouchableOpacity style={[styles.button, isFavorite && styles.buttonActive]} onPress={toggleFavorite}>
        <Text style={styles.buttonText}>{isFavorite ? "Remove from Favorites" : "Add to Favorites"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => addToShoppingList(recipe.ingredientLines)}>
        <Text style={styles.buttonText}>Add to Shopping List</Text>
      </TouchableOpacity>
      {recipe.url && (
        <>
          <Text style={styles.subtitle}>Instructions:</Text>
          <TouchableOpacity style={styles.button} onPress={() => setShowWebView(true)}>
            <Text style={styles.buttonText}>View Instructions</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  image: {
    width: '100%',
    height: 350,
    borderRadius: 10,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#666',
  },
  ingredient: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  button: {
    backgroundColor: '#0288D1',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#FFC107',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default RecipeDetailsScreen;
