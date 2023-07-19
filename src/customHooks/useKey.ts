import { useEffect } from "react";

export function useKey(key: string, action?: () => void) {
	useEffect(() => {
		const closeListener = (e: KeyboardEvent) => {
			if (e.code.toLowerCase() === key.toLowerCase()) action?.();
		};

		document.addEventListener("keydown", closeListener);

		return () => document.removeEventListener("keydown", closeListener);
	}, [action, key]);
}
