import { registerEnumType } from "type-graphql";

export enum MilestoneTags {
    GENERIC = "generic",
}

registerEnumType(MilestoneTags, {
    name: "MilestoneTags",
});
