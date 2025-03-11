"use client";

import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import Meals from "./components/meals";

const ITEMS_PER_PAGE = 6;



export default function HomePage() {
  const [search, setSearch] = useState("");
  const debouncedSearchTerm = useDebounce(search, 300);
  const [selectedCategory, setSelectedCategory] = useState("Всі");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedCategory]);
 
  const {
    data: meals,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["meals", debouncedSearchTerm],
    queryFn: async () => {
      const res = await fetch(
        "https://www.themealdb.com/api/json/v1/1/search.php?s=" +
          debouncedSearchTerm
      );
      const data = await res.json();
      return data.meals || [];
    },
    placeholderData: keepPreviousData
  });



  const categories = meals ? [
    "Всі",
    ...new Set(meals.map((meal: any) => meal.strCategory)),
  ]: [];

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

  // const handleSearch = (e) => setSearch(e.target.value);

  return (
    <div>
      <h1>Всі рецепти</h1>
      <input
        id="search"
        type="text"
        spellCheck="false"
        placeholder="Search a Title"
        value={search || ""}
        onChange={(e) => setSearch(e.target.value)}
      />
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

      <Meals meals={paginatedMeals} isLoading={isLoading} error={error}/>

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
