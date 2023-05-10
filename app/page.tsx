'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDebounce } from 'use-debounce';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

interface Drink {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
}

interface DrinkItemProps {
  drink: Drink;
}

const DrinkItem = ({ drink }: DrinkItemProps) => (
  <div key={drink.idDrink}>
    <Link href={`/${drink.idDrink}`} className="flex h-16 border-t border-zinc-400 align-center">
      <Image src={drink.strDrinkThumb} alt={drink.strDrink} width="18" height="18" className="ml-3 mr-4 my-3 pa-0 w-10 h-10 rounded-full" />
      <span className="text-base flex items-center">{drink.strDrink}</span>
    </Link>
  </div>
);

const Home = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [debouncedValue] = useDebounce<string>(searchTerm, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const searchCocktail = async (search: string): Promise<Drink[]> => {
    try {
      const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${search}`);
      const data = await response.json();
      return data.drinks ?? [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    if (!debouncedValue) return;
    searchCocktail(debouncedValue).then(setDrinks);
  }, [debouncedValue]);

  return (
    <div className="mx-auto my-4 h-full">
      <input type="text" value={searchTerm} onChange={handleChange} placeholder="Find a drink" className="form-input px-4 py-2 mb-4 rounded-md border-gray w-full" />
      <PerfectScrollbar className="content">
        {drinks.map((drink) => (
          <DrinkItem key={drink.idDrink} drink={drink} />
        ))}
      </PerfectScrollbar>
    </div>
  );
};

export default Home;