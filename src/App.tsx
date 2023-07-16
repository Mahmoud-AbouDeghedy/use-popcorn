import { useEffect, useState } from "react";

type MovieT = {
	imdbID: string;
	Title: string;
	Year: string;
	Poster: string;
	runtime?: number;
	imdbRating?: number;
	userRating?: number;
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

const tempWatchedData = [
	{
		imdbID: "tt1375666",
		Title: "Inception",
		Year: "2010",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
		runtime: 148,
		imdbRating: 8.8,
		userRating: 10,
	},
	{
		imdbID: "tt0088763",
		Title: "Back to the Future",
		Year: "1985",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
		runtime: 116,
		imdbRating: 8.5,
		userRating: 9,
	},
];

const average = (arr: number[]) =>
	arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "671ae6e0";
export default function App() {
	const [query, setQuery] = useState("");
	const [movies, setMovies] = useState(tempMovieData);
	const [watched, setWatched] = useState(tempWatchedData);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [selectedId, setSelectedId] = useState<null | string>(null);

	function handleSelectedId(id: string) {
		if (id === selectedId) setSelectedId(null);
		else setSelectedId(id);
	}
	function handleCloseMovie() {
		setSelectedId(null);
	}

	useEffect(() => {
		async function fetchMovies() {
			try {
				setError("");
				setIsLoading(true);
				const res = await fetch(
					`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
				);
				if (!res.ok) throw new Error("Error fetching movies");

				const data = await res.json();
				if (data.Response === "False") throw new Error("Movie not found");

				setMovies(data.Search);
				console.log(data);
			} catch (err: any) {
				console.error(err.message);
				setError(err.message);
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
						<MovieDetails id={selectedId} onCloseMovie={handleCloseMovie} />
					) : (
						<>
							<WatchedSummary watched={watched} />
							<WatchedList watched={watched} />
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
	return (
		<input
			className="search"
			type="text"
			placeholder="Search movies..."
			value={query}
			onChange={(e) => setQuery(e.target.value)}
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
		<li key={movie.imdbID} onClick={() => onSelectId(movie.imdbID)}>
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
}: {
	id: string;
	onCloseMovie: () => void;
}) {
	return (
		<div className="details">
			<button className="btn-back" onClick={onCloseMovie}>
				&larr;
			</button>
			{id}
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
	const userRatings: number[] = watched.map((movie) => movie.userRating!);
	const runtimes: number[] = watched.map((movie) => movie.runtime!);

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
					<span>{avgImdbRating}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{avgUserRating}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{avgRuntime} min</span>
				</p>
			</div>
		</div>
	);
}

function WatchedList({ watched }: { watched: MovieT[] }) {
	return (
		<ul className="list">
			{watched.map((movie) => (
				<WatchedMovie movie={movie} key={movie.imdbID} />
			))}
		</ul>
	);
}

function WatchedMovie({ movie }: { movie: MovieT }) {
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
					<span>{movie.userRating}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{movie.runtime} min</span>
				</p>
			</div>
		</li>
	);
}
