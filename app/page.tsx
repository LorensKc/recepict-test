"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const fetchMeals = async () => {
  const res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s="
  );
  const data = await res.json();
  return data.meals || [];
};

export default function HomePage() {
  const {
    data: meals,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["meals"],
    queryFn: fetchMeals,
  });

  const [selectedCategory, setSelectedCategory] = useState("Всі");

  const categories = [
    "Всі",
    ...new Set(meals?.map((meal: any) => meal.strCategory)),
  ];

  const filteredMeals =
    selectedCategory === "Всі"
      ? meals
      : meals.filter((meal: any) => meal.strCategory === selectedCategory);

  if (isLoading) return <p>Завантаження...</p>;
  if (error) return <p>Помилка завантаження</p>;

  return (
    <div>
      <h1>Всі рецепти</h1>
      <label>
        Фільтрувати за категорією:
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {filteredMeals.map((meal: any) => (
          <div
            key={meal.idMeal}
            style={{ border: "1px solid #ccc", padding: "10px" }}
          >
            <img src={meal.strMealThumb} alt={meal.strMeal} width="100%" />
            <h3>{meal.strMeal}</h3>
            <p>Категорія: {meal.strCategory}</p>
            <p>Країна: {meal.strArea}</p>
            <Link href={`/recipe/${meal.idMeal}`}>Детальніше</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
