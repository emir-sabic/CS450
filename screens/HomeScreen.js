import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import axios from 'axios';

const APP_ID = 'e8941a60';
const APP_KEY = '73ec7b12dbda0f2bdd2607131986c108';

const SEARCH_TERMS = ['chicken', 'beef', 'pasta', 'salad', 'soup', 'popular'];

const HomeScreen = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
              <Image source={{ uri: item.recipe.image }} style={styles.image} />
              <View style={styles.textContainer}>
                <Text style={styles.itemText}>{item.recipe.label}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.flatListContent}
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
  },
  flatListContent: {
    paddingBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    width: Dimensions.get('window').width - 32, // Ensure the item width fits within the screen
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
    flexShrink: 1,
  },
});

export default HomeScreen;
