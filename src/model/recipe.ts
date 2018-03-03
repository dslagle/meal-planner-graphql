import { model, Model, Schema, Document } from "mongoose";
import { IUser } from "./user";

export interface IRecipe extends Document {
    Name: String;
    Description: string;
    Author: IUser;
}

const RecipeSchema = new Schema({
    Name: String,
    Description: String,
    Author: { type: Schema.Types.ObjectId, ref: 'User' }
});

export const RecipeModel: Model<IRecipe> = model<IRecipe>("Recipe", RecipeSchema);
