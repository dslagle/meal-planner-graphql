import { GraphQLSchema } from "graphql";
import { RootQuery } from "./schema/query";
import { RootMutation } from "./schema/mutation";

export const MealPlannerSchema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
});
