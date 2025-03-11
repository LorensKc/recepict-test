"use client";

import { useQuery } from "@tanstack/react-query";

const fetchMealById = async (id: string) => {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await res.json();
  return data.meals ? data.meals[0] : null;
};

export default function RecipePage({ params }: any) {
  const {
    data: meal,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["meal", params.id],
    queryFn: () => fetchMealById(params.id),
  });

  if (isLoading) return <p>Завантаження...</p>;
  if (error || !meal) return <p>Рецепт не знайдено</p>;

  return (
    <div>
      <h1>{meal.strMeal}</h1>
      <img src={meal.strMealThumb} alt={meal.strMeal} width={300} />
      <p>
        <strong>Категорія:</strong> {meal.strCategory}
      </p>
      <p>
        <strong>Кухня:</strong> {meal.strArea}
      </p>
      <p>
        <strong>Інструкції:</strong>
      </p>
      <p>{meal.strInstructions}</p>
    </div>
  );
}
