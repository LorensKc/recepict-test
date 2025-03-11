"use client";

import { useState } from "react";

export default function SelectedRecipesPage() {
  const [selectedMeals, setSelectedMeals] = useState<any[]>([]);

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
        </div>
      )}
    </div>
  );
}
