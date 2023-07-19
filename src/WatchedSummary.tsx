import { MovieT, average } from "./App";

export function WatchedSummary({ watched }: { watched: MovieT[] }) {
	const imdbRatings: number[] = watched.map((movie) => movie.imdbRating!);
	const userRatings: number[] = watched.map((movie) => movie.UserRating!);
	const runtimes: number[] = watched.map(
		(movie) => +movie.Runtime?.split(" ")[0]!
	);

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
