import { GraphQLObjectType } from "graphql";

import { RecipeInputType, RecipeSchema } from "./recipe";
import { RecipeIngredientInputType, RecipeIngredientSchema } from "./recipe-ingredient";
import { IngredientInputType, IngredientSchema } from "./ingredient";

import { IngredientModel, RecipeModel, RecipeIngredientModel } from "../model";

export const RootMutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        CreateIngredient: {
            type: IngredientSchema,
            args: {
                Ingredient: { type: IngredientInputType }
            },
            async resolve(obj, args, ctx, info) {
                const { Name, Description, Price } = args.Ingredient;
                const ingredient = await new IngredientModel({ Name, Description, Price }).save();

                return {
                    Name: ingredient.Name,
                    Price: ingredient.Price,
                    Description: ingredient.Description
                };
            }
        },
        CreateRecipe: {
            type: RecipeSchema,
            args: {
                Recipe: { type: RecipeInputType }
            },
            async resolve(obj, args, ctx, info) {
                const { Name, Description, Ingredients } = args.Recipe;
                const recipe = await new RecipeModel({ Name, Description }).save();

                await Promise.all(
                    Ingredients.map(ing => new RecipeIngredientModel({
                        Recipe: recipe._id,
                        Ingredient: ing.Ingredient,
                        Amount: ing.Amount,
                        Unit: ing.Unit
                    }).save())
                );

                return {
                    Name: recipe.Name,
                    Description: recipe.Description
                };
            }
        }
    }
});
