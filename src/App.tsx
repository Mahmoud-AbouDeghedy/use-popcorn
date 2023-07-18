import { useEffect, useState, useRef } from "react";

import StarRating from "./StarRating";

type MovieT = {
	imdbID?: string;
	Title?: string;
	Year?: string;
	Poster?: string;
	Runtime?: number;
	imdbRating?: number;
	UserRating?: number;
	Plot?: string;
	Released?: string;
	Actors?: string;
	Director?: string;
	Genre?: string;
};

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

// const tempWatchedData = [
// 	{
// 		imdbID: "tt1375666",
// 		Title: "Inception",
// 		Year: "2010",
// 		Poster:
// 			"https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
// 		Runtime: 148,
// 		imdbRating: 8.8,
// 		UserRating: 10,
// 	},
// 	{
// 		imdbID: "tt0088763",
// 		Title: "Back to the Future",
// 		Year: "1985",
// 		Poster:
// 			"https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
// 		Runtime: 116,
// 		imdbRating: 8.5,
// 		UserRating: 9,
// 	},
// ];

const average = (arr: number[]) =>
	arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "671ae6e0";
export default function App() {
	const [query, setQuery] = useState("");
	const [movies, setMovies] = useState(tempMovieData);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [selectedId, setSelectedId] = useState<null | string>(null);
	const [watched, setWatched] = useState<MovieT[]>(() => {
		const storedValue = localStorage.getItem("watched");
		return JSON.parse(storedValue!);
	});

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

	useEffect(() => {
		localStorage.setItem("watched", JSON.stringify(watched));
	}, [watched]);

	useEffect(() => {
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

		handleCloseMovie();
		fetchMovies();

		return () => controller.abort();
	}, [query]);

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

function Loader() {
	return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }: { message: string }) {
	return (
		<p className="error">
			<span>⛔</span>
			{message}
		</p>
	);
}

function NavBar({ children }: { children: React.ReactNode }) {
	return (
		<nav className="nav-bar">
			<Logo />
			{children}
		</nav>
	);
}

function NumResults({ numResults }: { numResults: number }) {
	return (
		<p className="num-results">
			Found <strong>{numResults}</strong> results
		</p>
	);
}

function Logo() {
	return (
		<div className="logo">
			<span role="img">🍿</span>
			<h1>usePopcorn</h1>
		</div>
	);
}
function Search({
	query,
	setQuery,
}: {
	query: string;
	setQuery: React.Dispatch<React.SetStateAction<string>>;
}) {
	const inputEl = useRef<HTMLInputElement>(null);

	useEffect(() => {
		function cb(e: KeyboardEvent) {
			if (document.activeElement === inputEl.current) return;
			if (e.code === "Enter") {
				if (inputEl.current) inputEl.current.focus();
				setQuery("");
			}
		}

		document.addEventListener("keydown", cb);

		return () => document.removeEventListener("keydown", cb);
	}, [setQuery]);

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
function Main({ children }: { children: React.ReactNode }) {
	return <main className="main">{children}</main>;
}

function Movie({
	movie,
	onSelectId,
}: {
	movie: MovieT;
	onSelectId: (id: string) => void;
}) {
	return (
		<li key={movie.imdbID} onClick={() => onSelectId(movie.imdbID!)}>
			<img src={movie.Poster} alt={`${movie.Title} poster`} />
			<h3>{movie.Title}</h3>
			<div>
				<p>
					<span>🗓</span>
					<span>{movie.Year}</span>
				</p>
			</div>
		</li>
	);
}

function MoviesList({
	movies,
	onSelectId,
}: {
	movies: MovieT[];
	onSelectId: (id: string) => void;
}) {
	return (
		<ul className="list list-movies">
			{movies?.map((movie) => (
				<Movie movie={movie} key={movie.imdbID} onSelectId={onSelectId} />
			))}
		</ul>
	);
}

function MovieDetails({
	id,
	onCloseMovie,
	onAddWatched,
	watched,
}: {
	id: string;
	onCloseMovie: () => void;
	onAddWatched: (m: MovieT) => void;
	watched: MovieT[];
}) {
	const [movie, setMovie] = useState<MovieT>({});
	const [isLoading, setIsLoading] = useState(false);
	const [userRating, setUserRating] = useState(0);

	const isWatched = watched.map((el) => el.imdbID).includes(id);
	const watchedUserRating = watched.find(
		(movie) => movie.imdbID === id
	)?.UserRating;

	const {
		Title: title,
		Year: year,
		Poster: poster,
		Runtime: runtime,
		imdbRating,
		Plot: plot,
		Released: released,
		Actors: actors,
		Director: director,
		Genre: genre,
	} = movie;

	useEffect(() => {
		const closeListener = (e: KeyboardEvent) => {
			if (e.code === "Escape") onCloseMovie();
		};

		document.addEventListener("keydown", closeListener);

		return () => document.removeEventListener("keydown", closeListener);
	}, [onCloseMovie]);

	useEffect(() => {
		async function getMovieDetails() {
			setIsLoading(true);
			const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${id}`);
			const data = await res.json();
			setMovie(data);
			setIsLoading(false);
		}
		getMovieDetails();
	}, [id]);

	useEffect(() => {
		if (!title) return;
		document.title = `Movie | ${title}`;

		return () => {
			document.title = "usePopcorn";
		};
	}, [title]);

	function handleAdd() {
		const newMovie = {
			imdbRating,
			Title: title,
			Year: year,
			Poster: poster,
			Runtime: runtime,
			imdbID: id,
			UserRating: userRating,
		};
		onAddWatched(newMovie);

		onCloseMovie();
	}

	return (
		<div className="details">
			{isLoading ? (
				<Loader />
			) : (
				<>
					<header>
						<button className="btn-back" onClick={onCloseMovie}>
							&larr;
						</button>
						<img src={poster} alt={`Poster of ${title} movie`} />
						<div className="details-overview">
							<h2>
								{title} ({year})
							</h2>
							<p>
								{released} &bull; {runtime}
							</p>
							<p>{genre}</p>
							<p>
								<span>⭐</span>
								{imdbRating} IMdb rating
							</p>
						</div>
					</header>

					<section>
						<div className="rating">
							{!isWatched ? (
								<>
									<StarRating
										maxRating={10}
										size={24}
										onSetRating={setUserRating}
									/>

									{userRating > 0 && (
										<button className="btn-add" onClick={handleAdd}>
											+ Add to list
										</button>
									)}
								</>
							) : (
								<p>
									You rated this movie {watchedUserRating} <span>⭐</span>
								</p>
							)}
						</div>
						<p>
							<em>{plot}</em>
						</p>
						<p>Starring {actors}</p>
						<p>Directed by {director}</p>
					</section>
				</>
			)}
		</div>
	);
}

function Box({ children }: { children: React.ReactNode }) {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<div className="box">
			<button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
				{isOpen ? "–" : "+"}
			</button>
			{isOpen && children}
		</div>
	);
}

function WatchedSummary({ watched }: { watched: MovieT[] }) {
	const imdbRatings: number[] = watched.map((movie) => movie.imdbRating!);
	const userRatings: number[] = watched.map((movie) => movie.UserRating!);
	const runtimes: number[] = watched.map((movie) => movie.Runtime!);

	const avgImdbRating = average(imdbRatings);
	const avgUserRating = average(userRatings);
	const avgRuntime = average(runtimes);

	return (
		<div className="summary">
			<h2>Movies you watched</h2>
			<div>
				<p>
					<span>#️⃣</span>
					<span>{watched.length} movies</span>
				</p>
				<p>
					<span>⭐️</span>
					<span>{avgImdbRating.toFixed(2)}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{avgUserRating.toFixed(2)}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{avgRuntime} min</span>
				</p>
			</div>
		</div>
	);
}

function WatchedList({
	watched,
	onDeleteMovie,
}: {
	watched: MovieT[];
	onDeleteMovie: (id: string) => void;
}) {
	return (
		<ul className="list">
			{watched.map((movie) => (
				<WatchedMovie
					movie={movie}
					key={movie.imdbID}
					onDeleteMovie={onDeleteMovie}
				/>
			))}
		</ul>
	);
}

function WatchedMovie({
	movie,
	onDeleteMovie,
}: {
	movie: MovieT;
	onDeleteMovie: (id: string) => void;
}) {
	return (
		<li>
			<img src={movie.Poster} alt={`${movie.Title} poster`} />
			<h3>{movie.Title}</h3>
			<div>
				<p>
					<span>⭐️</span>
					<span>{movie.imdbRating}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{movie.UserRating}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{movie.Runtime}</span>
				</p>
				<button
					className="btn-delete"
					onClick={() => onDeleteMovie(movie.imdbID!)}
				></button>
			</div>
		</li>
	);
}
