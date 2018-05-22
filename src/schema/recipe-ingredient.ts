import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
    GraphQLFloat,
    GraphQLInputObjectType
} from "graphql";
import { RecipeSchema } from "./recipe";

export const RecipeIngredientSchema = new GraphQLObjectType({
    name: "RecipeIngredient",
    fields: () => ({
        Recipe: {
            type: RecipeSchema,
            resolve(obj, args, { loader }, info) {
                loader.LoadRecipe(obj.Recipe);
            }
        },
        Id: { type: new GraphQLNonNull(GraphQLID), resolve: (obj) => obj._id },
        Name: { type: GraphQLString },
        Description: { type: GraphQLString },
        Price: { type: GraphQLFloat },
        Amount: { type: GraphQLFloat },
        Unit: { type: GraphQLString }
    })
});

export const RecipeIngredientInputType = new GraphQLInputObjectType({
    name: "RecipeIngredientInput",
    fields: {
        Ingredient: { type: new GraphQLNonNull(GraphQLID) },
        Amount: { type: new GraphQLNonNull(GraphQLFloat) },
        Unit: { type: new GraphQLNonNull(GraphQLString) }
    }
});
