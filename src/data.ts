import { Db } from "mongodb";
import { connect, disconnect } from "mongoose";

import { IngredientModel, IIngredient } from "./model/ingredient";
import { RecipeModel, IRecipe } from "./model/recipe";
import { UserModel, IUser } from "./model/user";
import { RecipeIngredientModel, IRecipeIngredient } from "./model/recipe-ingredient";

async function go() {
    const db = await connect("mongodb://localhost:27017/MealPlanner");

    const user1 = await new UserModel({ Name: "Derek Slagle", Recipes: [] }).save();
    const user2 = await new UserModel({ Name: "James Sral", Recipes: [] }).save();

    const r1 = await new RecipeModel({ Name: "Chicken Parmesean", Description: "Delicious", Author: user1 }).save();

    const i1 = await new IngredientModel({ Name: "Chicken", Description: "Bird Meat", Price: 4.5 }).save();
    const i2 = await new IngredientModel({ Name: "Parmesean Cheese", Description: "The Good Stuff", Price: 7.5 }).save();

    const ri1 = await new RecipeIngredientModel({ Recipe: r1, Ingredient: i1, Amount: 2, Unit: "Breast" }).save();
    const ri2 = await new RecipeIngredientModel({ Recipe: r1, Ingredient: i2, Amount: 0.5, Unit: "lb" }).save();


    const r2 = await new RecipeModel({ Name: "Popcorn", Description: "meh", Author: user2 }).save();

    const i3 = await new IngredientModel({ Name: "Kernels", Description: "Dry, Hard Corn", Price: 3 }).save();
    const i4 = await new IngredientModel({ Name: "Canola Oil", Description: "The Good Stuff", Price: 1 }).save();

    const ri3 = await new RecipeIngredientModel({ Recipe: r2, Ingredient: i3, Amount: .5, Unit: "Cup" }).save();
    const ri4 = await new RecipeIngredientModel({ Recipe: r2, Ingredient: i4, Amount: 0.25, Unit: "Cup" }).save();

    await disconnect();
}

go();
