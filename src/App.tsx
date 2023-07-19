import { useState } from "react";

import { useMovies } from "./customHooks/useMovies";
import { useLocalStorageState } from "./customHooks/useLocalStorageState";
import { Loader } from "./Loader";
import { ErrorMessage } from "./ErrorMessage";
import { NavBar } from "./NavBar";
import { NumResults } from "./NumResults";
import { Search } from "./Search";
import { Main } from "./Main";
import { MoviesList } from "./MoviesList";
import { MovieDetails } from "./MovieDetails";
import { Box } from "./Box";
import { WatchedSummary } from "./WatchedSummary";
import { WatchedList } from "./WatchedList";

export type MovieT = {
	imdbID?: string;
	Title?: string;
	Year?: string;
	Poster?: string;
	Runtime?: string;
	imdbRating?: number;
	UserRating?: number;
	Plot?: string;
	Released?: string;
	Actors?: string;
	Director?: string;
	Genre?: string;
};

export const KEY = "671ae6e0";

export const average = (arr: number[]) =>
	arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
	const [query, setQuery] = useState("");

	const [selectedId, setSelectedId] = useState<null | string>(null);

	const [watched, setWatched] = useLocalStorageState([], "watched");

	function handleSelectedId(id: string) {
		if (id === selectedId) setSelectedId(null);
		else setSelectedId(id);
	}
	function handleCloseMovie() {
		setSelectedId(null);
	}

	function handleAddWatched(movie: MovieT) {
		setWatched((watched) => [...watched, movie]);
	}

	function handleDeleteWatched(id: string) {
		setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
	}

	const { movies, isLoading, error } = useMovies(query, handleCloseMovie);

	return (
		<>
			<NavBar>
				<Search query={query} setQuery={setQuery} />
				<NumResults numResults={movies.length} />
			</NavBar>

			<Main>
				<Box>
					{isLoading && <Loader />}
					{!isLoading && !error && (
						<MoviesList movies={movies} onSelectId={handleSelectedId} />
					)}
					{error && <ErrorMessage message={error} />}
				</Box>

				<Box>
					{selectedId ? (
						<MovieDetails
							id={selectedId}
							onAddWatched={handleAddWatched}
							onCloseMovie={handleCloseMovie}
							watched={watched}
						/>
					) : (
						<>
							<WatchedSummary watched={watched} />
							<WatchedList
								watched={watched}
								onDeleteMovie={handleDeleteWatched}
							/>
						</>
					)}
				</Box>
			</Main>
		</>
	);
}
