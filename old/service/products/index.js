const { buildSubgraphSchema } = require('@apollo/subgraph');
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { gql } = require('graphql-tag');
const typeDefs = gql`
    extend type Query{
        topProducts(first: Int = 5): [Product]
    }

    type Product @key(fields: "upc"){
        upc: String!
        name: String
        price: Int
        weight: Int
    }
`;

const products = [
  {
    upc: "1",
    name: "Table",
    price: 899,
    weight: 100
  },
  {
    upc: "2",
    name: "Couch",
    price: 1299,
    weight: 1000
  },
  {
    upc: "3",
    name: "Chair",
    price: 54,
    weight: 50
  }
];

const resolvers = {
  Product: {
    __resolveReference(object) {
      return products.find(product => product.upc === object.upc);
    }
  },
  Query: {
    topProducts(_, args) {
      return products.slice(0, args.first);
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
      port: 5003
    }
  });

  console.log(`Products service is ready at ${url}`);
})();