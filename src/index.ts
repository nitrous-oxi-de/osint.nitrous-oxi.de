/*
 * @file index.ts
 * @author David @dvhsh (https://dvh.sh)
 * @updated Thu Aug 9 2024
 * @description Main entry point for the application
 */
import "dotenv/config";

import { APIEnvironment }           from "@enum/eAPIEnvironment";
import pkg                          from "@package";

import fastify, {FastifyInstance }  from "fastify";
import rateLimit                    from "@fastify/rate-limit";
import compress                     from "@fastify/compress";
import helmet                       from "@fastify/helmet";
import cors                         from "@fastify/cors";

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

import osintRoute     from '@route/osint.route';
import apiRoute       from '@route/api.route';

/////////////////////////////////////////////////////////////
//
// Environment Variables
//
/////////////////////////////////////////////////////////////

const API_ENVIRONMENT : string = process.env.API_ENVIRONMENT as string;

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

    fastify.register(compress);
    fastify.register(helmet);
    fastify.register(cors);

    await osintRoute(fastify);
    await apiRoute(fastify);

    fastify.listen({port: PORT}, (err, address) => {

        if (err) { console.error(err); process.exit(1); }
    });
}

main(app).then(r => { console.log(`[${new Date().toLocaleString()}] [${pkg.version}/${API_ENVIRONMENT}] | Server started and listening at [${HOST}:${PORT}]`); });

// Path: src/index.ts
