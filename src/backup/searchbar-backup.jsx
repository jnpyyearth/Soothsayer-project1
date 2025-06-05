import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useState, useRef, useEffect } from "react";


function SearchBar({ searchTerm, setSearchTerm }) {
  const [inputValue, setInputValue] = useState(searchTerm || "");
  const debounceTimeoutRef = useRef(null);

  useEffect(() => {
    setInputValue(searchTerm || "");}, [searchTerm]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      setSearchTerm(value.trim());
    }, 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
      setSearchTerm(inputValue.trim());
    }
  };

  return (
    <div className="relative w-[550px]">
      <MagnifyingGlassIcon className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-indigo-800" />
      <input
        type="text"
        className="w-full py-2 pl-10 rounded-full border border-gray-700 bg-sky-100
      font-kanit text-indigo-800 text-lg
      shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 placeholder:text-indigo-700 "
        placeholder="Search it"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

export default SearchBar;
