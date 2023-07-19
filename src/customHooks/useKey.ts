import { useEffect } from "react";

export function useKey(key: string, action?: () => void) {
	useEffect(() => {
		const listenerfunction = (e: KeyboardEvent) => {
			if (e.code.toLowerCase() === key.toLowerCase()) action?.();
		};

		document.addEventListener("keydown", listenerfunction);

		return () => document.removeEventListener("keydown", listenerfunction);
	}, [action, key]);
}
