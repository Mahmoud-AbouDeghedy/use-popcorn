import { useState, useEffect } from "react";

import { MovieT } from "../App";

export function useLocalStorageState(
	initialState: MovieT[],
	keyName: string
): [val: MovieT[], setVal: React.Dispatch<React.SetStateAction<MovieT[]>>] {
	const [value, setValue] = useState<MovieT[]>(() => {
		const storedValue = localStorage.getItem(`${keyName}`);
		return storedValue ? JSON.parse(storedValue) : initialState;
	});

	useEffect(() => {
		localStorage.setItem(`${keyName}`, JSON.stringify(value));
	}, [value, keyName]);

	return [value, setValue];
}
