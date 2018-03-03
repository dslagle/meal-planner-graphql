import { model, Model, Schema, Document } from "mongoose";

export interface IIngredient extends Document {
    Name: String;
    Description: string;
    Price: number;
}

const IngredientSchema = new Schema({
    Name: String,
    Description: String,
    Price: Number
});

export const IngredientModel: Model<IIngredient> = model<IIngredient>("Ingredient", IngredientSchema);
