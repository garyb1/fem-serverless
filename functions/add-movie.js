const { query } = require("./util/hasura");

exports.handler = async (event) => {
	const { id, title, tagline, poster } = JSON.parse(event.body);

	const result = await query({
		query: `
            mutation ($id: String!, $title: String!, $tagline: String!, $poster: String!) {
                insert_movies_one(object: {id: $id, title: $title, tagline: $tagline, poster: $poster}) {
                    id
                    poster
                    tagline
                    title
                }
            }
        `,
		variables: { id, title, tagline, poster },
	});

	return {
		statusCode: 200,
		body: JSON.stringify(result),
	};
};
