import React from "react";
import { useLocation } from "react-router-dom";

function ResultsPage() {
  const location = useLocation();
  const results = location.state;

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h1>Food Recognition Results</h1>
      {results && results.length > 0 ? (
        <ul>
          {results.map((item: any, index: number) => (
            <li key={index} style={{ marginBottom: "20px" }}>
              <h2>{item.foodName}</h2>
              <p>Weight: {item.weight}g</p>
              <h3>Nutrition (per 100g):</h3>
              <ul>
                <li>Calories: {item.nutrition.per100g.calories} kcal</li>
                <li>Total Fat: {item.nutrition.per100g.totalFat}g</li>
                <li>Sugars: {item.nutrition.per100g.sugars}g</li>
                <li>Protein: {item.nutrition.per100g.protein}g</li>
                <li>Iron: {item.nutrition.per100g.iron}mg</li>
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
}

export default ResultsPage;
