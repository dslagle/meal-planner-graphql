import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLFloat,
    GraphQLInputObjectType
} from "graphql";

export const IngredientSchema = new GraphQLObjectType({
    name: "Ingredient",
    fields: {
        Id: { type: new GraphQLNonNull(GraphQLID), resolve: (obj) => obj._id },
        Name: { type: new GraphQLNonNull(GraphQLString) },
        Description: { type: GraphQLString },
        Price: { type: GraphQLFloat }
    }
});

export const IngredientInputType = new GraphQLInputObjectType({
    name: "IngredientInput",
    fields: {
        Name: { type: new GraphQLNonNull(GraphQLString) },
        Description: { type: new GraphQLNonNull(GraphQLString) },
        Price: { type: new GraphQLNonNull(GraphQLFloat) }
    }
});
