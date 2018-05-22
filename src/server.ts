import * as express from 'express';
import * as bp from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { connect, disconnect, Schema } from "mongoose";

import { MealPlannerSchema } from './root';
import { Loader } from "./loader";

const PORT = 3000;
const app = express();

// bodyParser is needed just for POST.
app.use('/graphql', bp.json(), graphqlExpress({
    schema: MealPlannerSchema,
    context: { loader: new Loader() }
}));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

connect('mongodb://localhost/MealPlanner').then(() => {
    app.listen(PORT);
    console.log('Listening!!');
});
