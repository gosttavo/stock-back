import "reflect-metadata";
import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import { AppDataSource } from "./database/data-source";
import { routers } from "./app/routes/routers.list";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(routers);

const port = Number(process.env.GLOBAL_PORT) || 3000;

AppDataSource.initialize().then(async () => {

    console.log(`Configured port: ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`DB Host: ${process.env.DB_HOST}`);
    console.log(`DB User: ${process.env.DB_USER}`);
    console.log(`DB Name: ${process.env.DB_NAME}`);

    app.listen(port, '0.0.0.0', () => {
        if (process.env.NODE_ENV === 'dev') {
            console.log(`Server running on port ${port}.`);
        } else {
            console.log(`Server running on port ${port}.`);
        }
    });
});