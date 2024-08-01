import "dotenv/config";

import { APIEnvironment }           from "@enum/eAPIEnvironment";
import pkg                          from "@package";

import fastify, {FastifyInstance }  from "fastify";
import rateLimit                    from "@fastify/rate-limit";
import compress                     from "@fastify/compress";
import helmet                       from "@fastify/helmet";
import cors                         from "@fastify/cors";

import mongoose                     from "mongoose";

/////////////////////////////////////////////////////////////
//
// Fastify / Server Configuration
//
/////////////////////////////////////////////////////////////

const PORT : number            = process.env.PORT ? parseInt(process.env.PORT) : 3008;
const HOST : String            = `localhost`;
const app  : FastifyInstance   = fastify({ logger: false });

/////////////////////////////////////////////////////////////
//
// Fastify / Server Routes
//
/////////////////////////////////////////////////////////////

import rOSINT     from '@route/rOSINT';
import rAPI       from '@route/rAPI';

/////////////////////////////////////////////////////////////
//
// Environment Variables
//
/////////////////////////////////////////////////////////////

const API_ENVIRONMENT : string = process.env.API_ENVIRONMENT as string;
const MONGO_URI       : string = process.env.MONGO_URI       as string;

// requests per minute
const handleRateLimit = (env: string) => {
    switch (env) {
        case APIEnvironment.Development : return 999;
        case APIEnvironment.Production  : return 60;
        case APIEnvironment.Sandbox     : return 100;
        default                         : return 0;
    }
}

// make sure essential environment variables are set
const environmentCheck = () => {
    // no environment defined
    if (!API_ENVIRONMENT)
        { throw new Error("API_ENVIRONMENT is not defined"); }

    // no mongo uri defined
    if (!MONGO_URI)
        { throw new Error("MONGO_URI is not defined"); }

    // invalid environment defined
    if (!Object.values(APIEnvironment).includes(API_ENVIRONMENT as APIEnvironment))
        { throw new Error("API_ENVIRONMENT is not a valid environment"); }
}

/////////////////////////////////////////////////////////////

async function main(fastify: FastifyInstance) {

    environmentCheck();

    await fastify.register(rateLimit, {
        max: handleRateLimit(API_ENVIRONMENT),
        timeWindow: '1 minute'
    });

    if (API_ENVIRONMENT === APIEnvironment.Production) {
        await mongoose.connect(MONGO_URI);
    }

    fastify.register(compress);
    fastify.register(helmet);
    fastify.register(cors);

    await rOSINT(fastify);
    await rAPI(fastify);

    fastify.listen({port: PORT}, (err, address) => {

        if (err) { console.error(err); process.exit(1); }
    });
}

main(app).then(r => { console.log(`[${new Date().toLocaleString()}] [${pkg.version}/${API_ENVIRONMENT}] | Server started and listening at [${HOST}:${PORT}]`); });

// Path: src/index.ts
