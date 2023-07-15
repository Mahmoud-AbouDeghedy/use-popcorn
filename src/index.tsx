import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import StarRating from "./StarRating";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<React.StrictMode>
		{/* <StarRating
			maxRating={5}
			messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
		/>
		<StarRating maxRating={9} defaultRating={8} /> */}
		<App />
	</React.StrictMode>
);
