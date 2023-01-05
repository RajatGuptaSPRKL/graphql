const { ApolloGateway, IntrospectAndCompose } = require('@apollo/gateway');
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

const supergraphSdl = new IntrospectAndCompose({
    subgraphs: [
        {
            name: "accounts", url: "http://localhost:5001/graphql",
            name: "inventory", url: "http://localhost:5002/graphql",
            name: "products", url: "http://localhost:5003/graphql",
            name: "reviews", url: "http://localhost:5004/graphql"
        }
    ]
});

const gateway = new ApolloGateway({
    supergraphSdl,
    __exposeQueryPlanExperimental: false
});

(async () => {
    const server = new ApolloServer({
        gateway
    });

    const { url } = await startStandaloneServer(server, {
        listen: {
            port: 5000
        }
    });

    console.log(`Gateway is ready at ${url}`);
})();