import { createModule, gql } from "graphql-modules";

const HTTPResponseModule = createModule({
	id: 'http-response',
	typeDefs: gql`
		type HTTPResponse {
			response: String
			error: String
		}
	`
})

export default HTTPResponseModule