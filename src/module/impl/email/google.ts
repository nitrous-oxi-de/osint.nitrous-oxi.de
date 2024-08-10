/*
 * @file google.ts
 * @author David @dvhsh (https://dvh.sh)
 * @updated Thu Aug 9 2024
 * @description Google email module
 */
import { ModuleCategory } from "@enum/eModuleCategory";
import { ModuleType }     from "@enum/eModuleType";

import { ModuleMeta }     from "@interface/iModuleMeta";

import { Module }         from "@module/module";

import { exec }           from "child_process";

import path               from "path";
import fs                 from "fs";

const META: ModuleMeta = {
    name        : "google",
    description : "Searches Google profile info using Ghunt based on a given gmail address.",

    thumbnail   : "",

    updatedAt   : "Sun Jun 30 2024",

    category    : ModuleCategory.Email,
    type        : ModuleType.Enrichment,
}

const SANDBOX: any = {

}

const temp : string = path.join(__dirname, "../../../../../", "temp");
const creds : string = path.join(__dirname, 'creds.txt');

export class Google extends Module {

    constructor() { super(META, SANDBOX); }

    public async query(query: string): Promise<any> {

        let execQuery : string = `ghunt email ${query} --json ../../../../../temp/${query}.json`;

        console.log(execQuery)

        const result = await new Promise((resolve, reject) => {
            exec(execQuery, (err, stdout, stderr) => {
                if (err) { reject(err); }
                resolve(stdout);
            });
        });

        // open the json and read the contents to a variable

        let exists = fs.existsSync(`${temp}/${query}.json`);
        let res = exists ? fs.readFileSync(`${temp}/${query}.json`, 'utf8') : null;

        // delete the file after reading
        if (exists) {
            fs.unlinkSync(`${temp}/${query}.json`);
        }

        return {
            status : exists ? 200                        : 404,
            data   : exists ? JSON.parse(<string>res) : null,
        };
    }
}

module.exports = new Google;

// Path: src/module/impl/email/google.ts
