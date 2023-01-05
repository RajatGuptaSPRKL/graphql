
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const { gql } = require('graphql-tag');
const users = [
    {
        id: "1",
        name: "Ada Lovelace",
        birthDate: "1815-12-10",
        username: "@ada"
    },
    {
        id: "2",
        name: "Alan Turing",
        birthDate: "1912-06-23",
        username: "@complete"
    }
];

const typeDefs = gql`
    extend type Query {
        me: User
    }

    type User @key(fields: "id") {
        id: ID!
        name: String
        username: String
    }
`;

const resolvers = {
    Query: {
        me() {
            return users[0];
        }
    },
    User: {
        __resolverReference(object) {
            return users.find(user => user.id === object.id);
        }
    }
};

const server = new ApolloServer({
    schema: buildSubgraphSchema(
        {
            typeDefs,
            resolvers
        }
    )
});

(async () => {
    const { url } = await startStandaloneServer(server, {
        listen: {
            port: 5001
        }
    });
    console.log(`Account service ready at ${url}}`);
})();

