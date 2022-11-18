const { Neo4jGraphQL } = require("@neo4j/graphql");
const { ApolloServer, gql } = require("apollo-server");
const neo4j = require("neo4j-driver");

const typeDefs = gql`#graphql
    type Game {
        gameId: Int!
        gameName: String
        isFavorited: Boolean
        publisher: Publisher @relationship(type: "PUBLISHED_BY", properties: "publishedIn",  direction: OUT)
        platform: Platform @relationship(type: "ON_PLATFORM", direction: OUT)
        genre: Genre @relationship(type: "HAS_GENRE", direction: OUT)
    }

    type Publisher {
        publisherId: String!
        games: [Game!]! @relationship(type: "PUBLISHED_BY", direction: IN)
    }

    type Platform {
        platformId: String!
        games: [Game!]! @relationship(type: "ON_PLATFORM", direction: IN)

    }

    type Genre{
        genreId: String!
        games: [Game!]! @relationship(type: "HAS_GENRE", direction: IN)
    }

    type Query{
        getAllGames: [Game]
        getGameByName(gameName: String!): Game
    }

    interface publishedIn @relationshipProperties {
        publishedYear: String
    }
`;


const driver = neo4j.driver(
    "neo4j://it2810-17.idi.ntnu.no:7687",
    neo4j.auth.basic("neo4j", "neo4j")
);

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

neoSchema.getSchema().then((schema) => {
    const server = new ApolloServer({
        schema,
    });

    server.listen(8080).then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
    });
})