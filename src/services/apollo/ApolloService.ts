import { ExpressApplication, Inject, Configuration, Service, BeforeRoutesInit } from "@tsed/common";
import { logWithColor } from "../../utils/default";
import { ApolloServer } from "apollo-server-express";
import { buildTypeDefsAndResolvers } from "type-graphql";
import { makeExecutableSchema } from "graphql-tools";
import { ProjectResolver } from "../projects/ProjectResolver";

@Service()
export class ApolloService implements BeforeRoutesInit {
    constructor(
        @Inject(ExpressApplication) private expressApplication: ExpressApplication,
        @Configuration() private configuration: Configuration
    ) {}

    async $beforeRoutesInit() {
        const options: any = this.configuration.get("graphql") || ({} as any);
        logWithColor("GraphQL Options", options);

        const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
            resolvers: [ProjectResolver],
        });

        const schema = makeExecutableSchema({ typeDefs, resolvers });
        console.log(typeDefs);
        console.log(resolvers);
        const apolloServer = new ApolloServer({ schema, typeDefs, resolvers, ...options["server1"] });
        apolloServer.applyMiddleware({ app: this.expressApplication });
    }
}
