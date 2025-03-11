"use client";

import { useEffect, useState } from "react";

export default function SelectedRecipesPage() {
  const [selectedMeals, setSelectedMeals] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const storedMeals = localStorage.getItem("selectedMeals");
    if (storedMeals) {
      const meals = JSON.parse(storedMeals);
      setSelectedMeals(meals);
      calculateIngredients(meals);
    }
  }, []);

  const calculateIngredients = (meals: any[]) => {
    const ingredientMap: { [key: string]: number } = {};

    meals.forEach((meal) => {
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== "") {
          const key = `${ingredient} (${measure})`;
          ingredientMap[key] = (ingredientMap[key] || 0) + 1;
        }
      }
    });

    setIngredients(ingredientMap);
  };

  return (
    <div>
      <h1>Вибрані рецепти</h1>
      {selectedMeals.length === 0 ? (
        <p>Ви ще не обрали жодного рецепту.</p>
      ) : (
        <div>
          {selectedMeals.map((meal) => (
            <div
              key={meal.idMeal}
              style={{ borderBottom: "1px solid #ccc", padding: "10px" }}
            >
              <h3>{meal.strMeal}</h3>
              <img src={meal.strMealThumb} alt={meal.strMeal} width={100} />
            </div>
          ))}

          <h2>Загальний список інгредієнтів</h2>
          <ul>
            {Object.entries(ingredients).map(([ingredient, count]) => (
              <li key={ingredient}>
                {ingredient} - {count} раз(и)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
