import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLList
} from "graphql";
import { UserSchema } from "./user";
import { RecipeSchema } from "./recipe";

export const RootQuery = new GraphQLObjectType({
    name: "Query",
    fields: () => ({
        User: {
            type: UserSchema,
            args: {
                UserId: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(obj, args, { loader }, info) {
                return loader.LoadUser(args.UserId);
            }
        },
        Users: {
            type: new GraphQLList(UserSchema),
            resolve(obj, args, { loader }, info) {
                return loader.LoadUsers();
            }
        },
        Recipes: {
            type: new GraphQLList(RecipeSchema),
            resolve(obj, args, { loader } , info) {
                return loader.LoadRecipes();
            }
        }
    })
});
