import { useState, useEffect } from "react";

const tempMovieData = [
	{
		imdbID: "tt1375666",
		Title: "Inception",
		Year: "2010",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
	},
	{
		imdbID: "tt0133093",
		Title: "The Matrix",
		Year: "1999",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
	},
	{
		imdbID: "tt6751668",
		Title: "Parasite",
		Year: "2019",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
	},
];

const KEY = "671ae6e0";

export function useMovies(query: string, handleCloseMovie?: () => void) {
	const [movies, setMovies] = useState(tempMovieData);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	useEffect(() => {
		handleCloseMovie?.();

		const controller = new AbortController();

		async function fetchMovies() {
			try {
				setError("");
				setIsLoading(true);
				const res = await fetch(
					`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
					{ signal: controller.signal }
				);
				if (!res.ok) throw new Error("Error fetching movies");

				const data = await res.json();
				if (data.Response === "False") throw new Error("Movie not found");

				setMovies(data.Search);
				setError("");
			} catch (err: any) {
				if (err.name !== "AbortError") {
					console.log(err.message);
					setError(err.message);
				}
			} finally {
				setIsLoading(false);
			}
		}
		if (query.length < 3) {
			setError("");
			setMovies([]);
			return;
		}

		fetchMovies();

		return () => controller.abort();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query]);
	return { movies, isLoading, error };
}
