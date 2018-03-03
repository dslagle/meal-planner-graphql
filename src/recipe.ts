import {
    graphql,
    GraphQLObjectType,
    GraphQLID,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLSchema,
    GraphQLBoolean,
    GraphQLFloat
} from "graphql";

import { keyBy } from "lodash";

import { IngredientModel, IIngredient } from "./model/ingredient";
import { RecipeModel, IRecipe } from "./model/recipe";
import { UserModel, IUser } from "./model/user";
import { RecipeIngredientModel, IRecipeIngredient } from "./model/recipe-ingredient";

import { connect, disconnect, Schema } from "mongoose";

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

class Loader {
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
    LoadRecipe(recipeId: string | Schema.Types.ObjectId): Promise<IRecipe> {
        return RecipeModel.findById(recipeId).then(v => v);
    }
}

const IngredientSchema = new GraphQLObjectType({
    name: "Ingredient",
    fields: {
        Name: { type: new GraphQLNonNull(GraphQLString) },
        Description: { type: GraphQLString },
        Price: { type: GraphQLFloat }
    }
});

const RecipeIngredientSchema = new GraphQLObjectType({
    name: "RecipeIngredient",
    fields: () => ({
        Recipe: {
            type: RecipeSchema,
            resolve(obj, args, { loader }, info) {
                loader.LoadRecipe(obj.Recipe);
            }
        },
        Name: { type: GraphQLString },
        Description: { type: GraphQLString },
        Price: { type: GraphQLFloat },
        Amount: { type: GraphQLFloat },
        Unit: { type: GraphQLString }
    })
});

const UserSchema = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        Name: { type: new GraphQLNonNull(GraphQLString) },
        Recipes: {
            type: new GraphQLList(RecipeSchema),
            resolve(obj, args, { loader }, info) {
                return loader.LoadRecipesByUser(obj._id);
            }
        }
    })
});

const RecipeSchema = new GraphQLObjectType({
    name: "Account",
    fields: () => ({
        Name: { type: new GraphQLNonNull(GraphQLString) },
        Description: { type: new GraphQLNonNull(GraphQLString) },
        Ingredients: {
            type: new GraphQLList(RecipeIngredientSchema),
            resolve(obj, args, { loader }, info) {
                return loader.LoadRecipeIngredients(obj._id);
            }
        },
        Author: {
            type: UserSchema,
            resolve(obj, args, { loader }, info) {
                return loader.LoadUser(obj.Author);
            }
        }
    })
});

const MealPlanSchema = new GraphQLObjectType({
    name: "MealPlan",
    fields: {
        Name: { type: new GraphQLNonNull(GraphQLString) },
        Author: { type: new GraphQLNonNull(UserSchema) },
        Recipes: { type: new GraphQLList(RecipeSchema) }
    }
});

const RootQuery = new GraphQLObjectType({
    name: "Query",
    fields: () => ({
        User: {
            type: UserSchema,
            args: {
                UserId: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(obj, args, { loader }, info) {
                return loader.LoadUser(args.UserId);
            }
        },
        Users: {
            type: new GraphQLList(UserSchema),
            resolve(obj, args, { loader }, info) {
                return loader.LoadUsers();
            }
        }
    })
});

const schema = new GraphQLSchema({
    query: RootQuery
});

var query = `query someQuery {
    Users {
        Name
        Recipes {
            Name
            Ingredients {
                Name
                Description
                Amount
                Unit
                Price
            }
        }
    }
}`;
const vars = {
    UserId: "5a9ae9927f82f37c878e1efc"
};

connect('mongodb://localhost/MealPlanner').then(() => {
    graphql(schema, query, null, { loader: new Loader() }, vars)
        .then(result => {
            if (result.errors) {
                console.error(result.errors);
            } else {
                console.log(JSON.stringify(result.data, null, 3));
            }
            disconnect();
        })
        .catch(err => {
            console.error(err);
            disconnect();
        })
});

// class test {
//     @Memoize()
//     add(a, b) {
//         return a + b;
//     }
// }

// const t = new test();
// console.log(t.add(4, 5));
// console.log(t.add(3, 5));
// console.log(t.add(4, 5));
