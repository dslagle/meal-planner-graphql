import { model, Model, Schema, Document } from "mongoose";
import { IRecipe } from "./recipe";

export interface IUser extends Document {
    Name: String;
    Recipes: IRecipe[];
}

const UserSchema = new Schema({
    Name: String,
    Recipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }]
});

export const UserModel: Model<IUser> = model<IUser>("User", UserSchema);
