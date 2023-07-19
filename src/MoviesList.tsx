import { Movie } from "./Movie";
import { MovieT } from "./App";

export function MoviesList({
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
