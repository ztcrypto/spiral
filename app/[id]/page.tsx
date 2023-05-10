'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PieChart } from 'react-minimal-pie-chart';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Image from 'next/image';
import 'react-perfect-scrollbar/dist/css/styles.css';

// Define the interface for each ingredient
interface Ingredient {
  name: string;
  value: string;
  color: string;
}

// Define the interface for each ingredient in the pie chart
interface IngredientChart {
  name: string;
  value: number;
  color: string;
}

// Define an array of colors to use for the ingredients
const colors = [
  '#FF4136', // red
  '#FF851B', // orange
  '#FFDC00', // yellow
  '#2ECC40', // green
  '#0074D9', // blue
  '#B10DC9', // purple
  '#85144b', // maroon
  '#3D9970', // olive
  '#F012BE', // fuchsia
  '#39CCCC', // teal
  '#01FF70', // lime
  '#7FDBFF', // aqua
  '#AAAAAA', // gray
  '#001f3f', // navy
  '#F012BE' // magenta
];

const standardAmounts: { [key: string]: number } = {
  oz: 1,
  cl: 0.33814,
  tsp: 0.166667,
  tblsp: 0.5,
  cup: 8,
  dash: 40
};

// Define the interface for the drink
interface Drink {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strInstructions: string;
}

// Define the component for the drink detail page
export default function DrinkDetail() {
  const { id } = useParams();
  const [drink, setDrink] = useState<Drink | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [ingredientsChart, setIngredientsChart] = useState<IngredientChart[]>([]);

  useEffect(() => {
    async function fetchDrink() {
      const drinkData = await getDrink(id);
      if (drinkData) {
        setDrink(drinkData);
        const newIngredients = [];
        const newIngredientsChart = [];
        for (let i = 1; i <= 15; i++) {
          const ingredient = drinkData[`strIngredient${i}`];
          const measurement = drinkData[`strMeasure${i}`];
          if (ingredient) {
            const color: string = colors[newIngredients.length];
            newIngredients.push({ name: ingredient, value: measurement, color });
            if (measurement) {
              const key = measurement.replace(/[^a-z.]/g, '').trim();
              if (Object.keys(standardAmounts).includes(key)) {
                const convertedAmount = eval(measurement.replace(/[a-z.\s]/g, '')) * standardAmounts[key];
                newIngredientsChart.push({ name: ingredient, value: convertedAmount, color });
              }
            }
          }
        }
        setIngredients(newIngredients);
        setIngredientsChart(newIngredientsChart);
      }
    }
    fetchDrink();
  }, [id]);

  if (!drink) {
    return <div className="justify-center mt-10 flex w-full">Fetching...</div>;
  }

  return (
    <div className="h-full">
      <PerfectScrollbar>
        <div className="flex flex-col">
          <Image src={drink.strDrinkThumb} alt={drink.strDrink} width="160" height="160" className="mt-8 w-40 h-40 rounded-full self-center"/>
          <h1 className="my-4 font-bold text-xl text-center">{drink.strDrink}</h1>
          <h2 className="ml-5 mt-8 mb-5 font-bold text-base">Ingredients</h2>
          <div className="flex">
            <ul className="m-5">
              {ingredients.map(item => 
                <div key={item.name} className="flex my-2">
                  <div style={{background: item.color}} className="w-5 h-5"></div>
                  <span className="text-base leading-4 ml-2">{item.name} {item.value}</span>
                </div>
              )}
            </ul>
            <div className="m-5 w-32">
              <PieChart data={ingredientsChart} />
            </div>
          </div>
          <p className="mx-5 mt-8 mb-5 text-base">{drink.strInstructions}</p>
        </div>
      </PerfectScrollbar>
    </div>
  );
}

async function getDrink(id: string) {
  try {
    const res = await fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    const data = await res.json();
    const drink = data.drinks[0];
    return drink;
  } catch (err) {
    console.log(err);
    return null;
  }
}