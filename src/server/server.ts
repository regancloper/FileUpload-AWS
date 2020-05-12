import * as express from 'express';
import * as busboyBodyParser from 'busboy-body-parser';
import apiRouter from './routes';

const app = express();


app.use(express.static('public'));
app.use(express.json());
app.use(busboyBodyParser());
app.use(apiRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port: ${port}`));
