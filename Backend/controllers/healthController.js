// controllers/healthController.js
require('dotenv').config(); // Load environment variables

// Function to get nutrition data from CalorieNinjas
async function getCalorieInfo(foodItem) {
  try {
    // Construct the URL with the query parameter
    const response = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(foodItem)}`, {
      method: 'GET',
      headers: {
        'X-Api-Key': process.env.CALORIE_NINJAS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data from CalorieNinjas');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching CalorieNinjas data:', error);
    throw error;
  }
}

// Function to get exercise data from Nutritionix
async function getExerciseInfo(exerciseQuery) {
  try {
    const response = await fetch('https://trackapi.nutritionix.com/v2/natural/exercise', {
      method: 'POST',
      headers: {
        'x-app-id': process.env.NUTRITIONIX_APP_ID,
        'x-app-key': process.env.NUTRITIONIX_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: exerciseQuery }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data from Nutritionix');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Nutritionix data:', error);
    throw error;
  }
}

// Combined function to handle both requests
// Combined function to handle both requests
async function getHealthInfo(req, res) {
    const { foodItem, exerciseQuery } = req.body;
  
    try {
      const calorieData = await getCalorieInfo(foodItem); // Get nutrition data
      const exerciseData = await getExerciseInfo(exerciseQuery); // Get exercise data
  
      // Calculate total calories gained and nutritional sums
      const nutritionItems = calorieData.items || [];
      const totalCaloriesFromFood = nutritionItems.reduce((sum, item) => sum + item.calories, 0);
      
      // Calculate total calories burned from exercise
      const totalCaloriesBurned = exerciseData.exercises.reduce((sum, exercise) => sum + exercise.nf_calories, 0);
  
      // Calculate summed nutritional values
      const totalCarbohydrates = nutritionItems.reduce((sum, item) => sum + item.carbohydrates_total_g, 0);
      const totalProtein = nutritionItems.reduce((sum, item) => sum + item.protein_g, 0);
      const totalFiber = nutritionItems.reduce((sum, item) => sum + item.fiber_g, 0);
      const totalFat = nutritionItems.reduce((sum, item) => sum + item.fat_total_g, 0);
  
      const caloriesGained = totalCaloriesFromFood - totalCaloriesBurned;
  
      // Return the combined response
      res.json({
        caloriesGained,
        totalCarbohydrates,
        totalProtein,
        totalFiber,
        totalFat,
      });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching health information' });
    }
  }
  
module.exports = { getHealthInfo };