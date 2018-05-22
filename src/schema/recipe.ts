import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLInputObjectType
} from "graphql";
import { UserSchema } from "./user";
import { RecipeIngredientInputType, RecipeIngredientSchema } from "./recipe-ingredient";
import { Loader } from "../loader";

export const RecipeSchema = new GraphQLObjectType({
    name: "Recipe",
    fields: () => ({
        Id: { type: new GraphQLNonNull(GraphQLID), resolve: (obj) => obj._id },
        Name: { type: new GraphQLNonNull(GraphQLString) },
        Description: { type: new GraphQLNonNull(GraphQLString) },
        Ingredients: {
            type: new GraphQLList(RecipeIngredientSchema),
            resolve(obj, args, { loader }: { loader: Loader }, info) {
                return loader.LoadRecipeIngredients(obj._id);
            }
        },
        Author: {
            type: UserSchema,
            resolve(obj, args, { loader }: { loader: Loader }, info) {
                return loader.LoadUser(obj.Author);
            }
        }
    })
});

export const RecipeInputType = new GraphQLInputObjectType({
    name: "RecipeInput",
    fields: {
        Name: { type: new GraphQLNonNull(GraphQLString) },
        Description: { type: new GraphQLNonNull(GraphQLString) },
        Ingredients: { type: new GraphQLList(RecipeIngredientInputType) }
    }
});
