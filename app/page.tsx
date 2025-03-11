"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const fetchMeals = async () => {
  const res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s="
  );
  const data = await res.json();
  return data.meals;
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

  if (isLoading) return <p>Завантаження...</p>;
  if (error) return <p>Помилка завантаження</p>;

  return (
    <div>
      <h1>Список рецептів</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        {meals?.map((meal: any) => (
          <div
            key={meal.idMeal}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              textAlign: "center",
            }}
          >
            <img src={meal.strMealThumb} alt={meal.strMeal} width={150} />
            <h3>{meal.strMeal}</h3>
            <p>
              {meal.strCategory} - {meal.strArea}
            </p>
            <Link href={`/recipe/${meal.idMeal}`}>Детальніше</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
