import { MovieT } from "./App";

export function Movie({
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
