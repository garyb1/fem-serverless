const { query } = require("./util/hasura");

exports.handler = async (event, context) => {
	const { id, title, tagline, poster } = JSON.parse(event.body);
	const { user } = context.clientContext;
	const isLoggedIn = user && user.app_metadata;
	const roles = user.app_metadata.roles || [];

	if (!isLoggedIn || !roles.includes("admin")) {
		return {
			statusCode: 401,
			body: "Unauthorized",
		};
	}

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
