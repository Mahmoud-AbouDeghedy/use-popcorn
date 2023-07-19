import { MovieT } from "./App";

export function WatchedMovie({
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
