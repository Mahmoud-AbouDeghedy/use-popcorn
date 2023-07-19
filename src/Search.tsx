import { useRef } from "react";
import { useKey } from "./customHooks/useKey";

export function Search({
	query,
	setQuery,
}: {
	query: string;
	setQuery: React.Dispatch<React.SetStateAction<string>>;
}) {
	const inputEl = useRef<HTMLInputElement>(null);

	useKey("enter", () => {
		if (document.activeElement === inputEl.current) return;
		if (inputEl.current) inputEl.current.focus();
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
