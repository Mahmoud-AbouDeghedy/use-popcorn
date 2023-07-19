import { MovieT } from "./App";
import { WatchedMovie } from "./WatchedMovie";

export function WatchedList({
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
