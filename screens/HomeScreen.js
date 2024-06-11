// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import axios from 'axios';

const APP_ID = 'e8941a60';
const APP_KEY = '73ec7b12dbda0f2bdd2607131986c108';

const SEARCH_TERMS = ['chicken', 'beef', 'pasta', 'salad', 'soup', 'popular'];

const HomeScreen = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const responses = await Promise.all(
          SEARCH_TERMS.map(term =>
            axios.get(`https://api.edamam.com/search?q=${term}&app_id=${APP_ID}&app_key=${APP_KEY}`)
          )
        );
        const allRecipes = responses.flatMap(response => response.data.hits);
        setRecipes(allRecipes);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch recipes');
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {recipes.length === 0 ? (
        <Text>No recipes found</Text>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.recipe.uri}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('RecipeDetails', { recipe: item.recipe })}>
              <Text style={styles.itemText}>{item.recipe.label}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    width: '100%',
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
