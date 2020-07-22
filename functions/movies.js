const { URL } = require("url");
const fetch = require("node-fetch");
const { query } = require("./util/hasura");

exports.handler = async () => {
	const { movies } = await query({
		query: `
			query {
				movies {
					title
					tagline
					id
					poster
				}
			}
		`,
	});

	const api = new URL("https://www.omdbapi.com/");
	api.searchParams.set("apikey", process.env.OMDB_API_KEY);

	const promises = movies.map((movie) => {
		//use the movies imdb id to look up details
		api.searchParams.set("i", movie.id);

		return fetch(api)
			.then((res) => res.json())
			.then((data) => {
				const scores = data.Ratings;

				return {
					...movie,
					scores,
				};
			});
	});

	const movieWithRatings = await Promise.all(promises);

	return {
		statusCode: 200,
		body: JSON.stringify(movieWithRatings),
	};
};
