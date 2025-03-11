import Link from "next/link";
import { useState, useEffect } from "react";

export default function Meals(props) {
    const { meals, isLoading, error } = props;
    const [selectedMeals, setSelectedMeals] = useState<any[]>(
    JSON.parse(localStorage.getItem("selectedMeals") || "[]")
    );
    useEffect(() => {
    localStorage.setItem("selectedMeals", JSON.stringify(selectedMeals));
    }, [selectedMeals]);
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

    if (isLoading) return <p>Завантаження...</p>;
    if (error || !meals) return <p>Помилка завантаження</p>;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px",
      }}
    >
      {meals.map((meal: any) => (
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
  );
}
