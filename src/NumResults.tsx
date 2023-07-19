export function NumResults({ numResults }: { numResults: number }) {
	return (
		<p className="num-results">
			Found <strong>{numResults}</strong> results
		</p>
	);
}
