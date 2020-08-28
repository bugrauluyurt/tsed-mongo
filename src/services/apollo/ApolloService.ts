import { AfterRoutesInit, Service, OnInit, Configuration, InjectorService } from "@tsed/common";
import { GraphQLService, GraphQLSettings } from "@tsed/graphql";
import { logWithColor } from "../../utils/default";

@Service()
export class ApolloService implements OnInit, AfterRoutesInit {
    private settings: GraphQLSettings;
    static readonly SERVER_NAME = "server1";

    constructor(
        private graphQLService: GraphQLService,
        private injector: InjectorService,
        @Configuration() private configuration: Configuration
    ) {}

    private async createServer(): Promise<any> {
        this.settings = this.configuration.get("graphqlSettings");
        await this.graphQLService.createServer(ApolloService.SERVER_NAME, this.settings);
    }

    async $onInit() {
        this.createServer();
    }

    $afterRoutesInit() {
        const host = this.configuration.getHttpPort();
        logWithColor(
            "GraphqlServer",
            `Available on https://${host.address}:${host.port}/${this.settings.path.replace(/^\//, "")}`
        );
    }
}
