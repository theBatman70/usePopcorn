import { useRef } from "react";
import { useEffect } from "react";
import { useKey } from "./customHooks/useKey";

export default function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  /* Focus on the Search Bar on First Mount of the Component */
  useEffect(function () {
    inputEl.current.focus();
  }, []);

  /* Focus the Search Bar when hitting Enter, clearing the current query */
  useKey("Enter", function () {
    if (inputEl.current === document.activeElement) return;
    inputEl.current.focus();
    setQuery("");
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
