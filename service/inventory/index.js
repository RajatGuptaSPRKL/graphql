const { buildSubgraphSchema } = require('@apollo/subgraph');
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { gql } = require('graphql-tag');
const typeDefs = gql`
    extend type Product @key(fields: "upc"){
        upc: String! @external
    }
    `;
// weight: Int @external
// price: Int @external
// inStock: Boolean
// shippingEstimate: Int @requires(fields: "price weight")

const inventory = [
    { upc: "1", inStock: true, weight: 2, price: 10 },
    { upc: "2", inStock: false, weight: 2, price: 10 },
    { upc: "3", inStock: true, weight: 2, price: 10 }
];

const resolvers = {
    Product: {
        __resolverReference(object) {
            return {
                ...object,
                ...inventory.find(inv => inv.upc === object.upc)
            };
        },
        shippingEstimate(object) {
            if (object.price > 1000) return 0;
            return object.weight * 0.5;
        }
    }
};

const server = new ApolloServer({
    schema: buildSubgraphSchema({
        typeDefs,
        resolvers
    })
});

(async () => {
    const { url } = await startStandaloneServer(server, {
        listen: {
            port: 5002
        }
    });

    console.log(`Inventory service is ready at ${url}`);
})();