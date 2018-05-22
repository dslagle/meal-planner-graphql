import { IngredientModel, IIngredient } from "./model/ingredient";
import { RecipeModel, IRecipe } from "./model/recipe";
import { UserModel, IUser } from "./model/user";
import { RecipeIngredientModel, IRecipeIngredient } from "./model/recipe-ingredient";

import { connect, disconnect, Schema } from "mongoose";
import { keyBy } from "lodash";

function Memoize(keyGen = (args: any[]) => args.join(",")) {
    const cache = {};

    return function (target, name, descriptor): any {
        const oldValue = descriptor.value;

        descriptor.value = function () {
            const key = keyGen(Array.from(arguments));

            if (key in cache) {
                return cache[key];
            }

            cache[key] = oldValue.apply(this, arguments);
            return cache[key];
        };

        return descriptor;
    }
}

export class Loader {
    @Memoize()
    LoadUsers() {
        return UserModel.find().then(v => v);
    }

    @Memoize()
    LoadUser(userId: string | Schema.Types.ObjectId): Promise<IUser> {
        return UserModel.findById(userId).then(v => v);
    }

    @Memoize()
    LoadRecipesByUser(userId: string | Schema.Types.ObjectId): Promise<IRecipe[]> {
        return RecipeModel.find({ Author: userId }).then(v => v);
    }

    @Memoize()
    async LoadRecipeIngredients(recipeId: string | Schema.Types.ObjectId): Promise<any[]> {
        const links = await RecipeIngredientModel.find({ Recipe: recipeId });
        const ingredients = keyBy((await IngredientModel.find({ '_id': { $in: links.map(l => l.Ingredient) } })), "_id");

        return links.map(l => ({
            Amount: l.Amount,
            Unit: l.Unit,
            Name: ingredients[l.Ingredient as any].Name,
            Description: ingredients[l.Ingredient as any].Description,
            Price: ingredients[l.Ingredient as any].Price
        }));
    }

    @Memoize()
    LoadIngredient(ingredientId: string | Schema.Types.ObjectId): Promise<IIngredient> {
        return IngredientModel.findById(ingredientId).then(v => v);
    }

    @Memoize()
    LoadRecipes(): Promise<IRecipe[]> {
        return RecipeModel.find().then(v => v);
    }

    @Memoize()
    LoadRecipe(recipeId: string | Schema.Types.ObjectId): Promise<IRecipe> {
        return RecipeModel.findById(recipeId).then(v => v);
    }
}