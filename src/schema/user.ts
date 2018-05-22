import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLList
} from "graphql";
import { RecipeSchema } from "./recipe";

export const UserSchema = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        Name: { type: new GraphQLNonNull(GraphQLString) },
        Recipes: {
            type: new GraphQLList(RecipeSchema),
            resolve(obj, args, { loader }, info) {
                return loader.LoadRecipesByUser(obj._id);
            }
        }
    })
});
