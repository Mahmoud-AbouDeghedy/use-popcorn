import { useEffect, useState, useRef } from "react";
import StarRating from "./StarRating";
import { useKey } from "./customHooks/useKey";
import { Loader } from "./Loader";
import { MovieT, KEY } from "./App";

export function MovieDetails({
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

	const countRef = useRef(0);

	useEffect(() => {
		if (userRating) countRef.current++;
	}, [userRating]);

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

	useKey("escape", onCloseMovie);

	useEffect(() => {
		async function getMovieDetails() {
			setIsLoading(true);
			const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&i=${id}`);
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
			countRatingDecisions: countRef.current,
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
