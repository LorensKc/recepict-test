"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const ITEMS_PER_PAGE = 6;

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
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMeals, setSelectedMeals] = useState<any[]>(
    JSON.parse(localStorage.getItem("selectedMeals") || "[]")
  );

  useEffect(() => {
    localStorage.setItem("selectedMeals", JSON.stringify(selectedMeals));
  }, [selectedMeals]);

  if (isLoading) return <p>Завантаження...</p>;
  if (error || !meals) return <p>Помилка завантаження</p>;

  const categories = [
    "Всі",
    ...new Set(meals.map((meal: any) => meal.strCategory)),
  ];

  const filteredMeals =
    selectedCategory === "Всі"
      ? meals
      : meals.filter((meal: any) => meal.strCategory === selectedCategory);

  const totalPages = Math.ceil((filteredMeals?.length || 0) / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMeals =
    filteredMeals?.slice(startIdx, startIdx + ITEMS_PER_PAGE) || [];

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleMealSelection = (meal: any) => {
    setSelectedMeals((prev) => {
      const exists = prev.some((m) => m.idMeal === meal.idMeal);
      if (exists) {
        return prev.filter((m) => m.idMeal !== meal.idMeal);
      } else {
        return [...prev, meal];
      }
    });
  };

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
        {paginatedMeals.map((meal: any) => (
          <div
            key={meal.idMeal}
            style={{ border: "1px solid #ccc", padding: "10px" }}
          >
            <img src={meal.strMealThumb} alt={meal.strMeal} width="100%" />
            <h3>{meal.strMeal}</h3>
            <p>Категорія: {meal.strCategory}</p>
            <p>Країна: {meal.strArea}</p>
            <Link href={`/recipe/${meal.idMeal}`}>Детальніше</Link>
            <button onClick={() => toggleMealSelection(meal)}>
              {selectedMeals.some((m) => m.idMeal === meal.idMeal)
                ? "Видалити"
                : "Вибрати"}
            </button>
          </div>
        ))}
      </div>

      {/* Пагінація */}
      {totalPages > 1 && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ◀
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => page <= 7 || page === totalPages)
            .map((page, index, arr) => (
              <span key={page}>
                <button
                  onClick={() => handlePageChange(page)}
                  disabled={page === currentPage}
                  style={{
                    fontWeight: page === currentPage ? "bold" : "normal",
                  }}
                >
                  {page}
                </button>
                {index === arr.length - 2 && page !== totalPages - 1 && (
                  <span> ... </span>
                )}
              </span>
            ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
}
