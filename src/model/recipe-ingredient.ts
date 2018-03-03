import { model, Model, Schema, Document } from "mongoose";
import { IIngredient } from "./ingredient";
import { IRecipe } from "./recipe";

export interface IRecipeIngredient extends Document {
    Ingredient: IIngredient;
    Recipe: IRecipe;
    Unit: String;
    Amount: Number;
}

const RecipeIngredientSchema = new Schema({
    Unit: String,
    Amount: Number,
    Ingredient: { type: Schema.Types.ObjectId, ref: 'Ingredient' },
    Recipe: { type: Schema.Types.ObjectId, ref: 'Recipe' }
});

export const RecipeIngredientModel: Model<IRecipeIngredient> = model<IRecipeIngredient>("RecipeIngredient", RecipeIngredientSchema);
