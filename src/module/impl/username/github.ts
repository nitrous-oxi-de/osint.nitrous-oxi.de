/*
 * @file github.ts
 * @author David @dvhsh (https://dvh.sh)
 * @updated Thu Aug 9 2024
 * @description GitHub username module
 */
import { ModuleCategory } from "@enum/eModuleCategory";
import { ModuleType }     from "@enum/eModuleType";

import { ModuleMeta }     from "@interface/iModuleMeta";

import { Module }         from "@module/module";

import axios              from "axios";

const META: ModuleMeta = {
    name        : "github",
    description : "Searches for GitHub profile info based on a given username.",

    thumbnail   : "",

    updatedAt   : "Sun Jun 30 2024",

    category    : ModuleCategory.Username,
    type        : ModuleType.Enrichment,
}

const SANDBOX: any = {

}

export class GitHub extends Module {

    constructor() { super(META, SANDBOX); }

    public async query(query: string): Promise<any> {

        const response = await axios.get(`https://api.github.com/users/${query}`);

        const exists = response.data.login.toLowerCase() === query.toLowerCase();

        return {
            status : exists ? 200           : 404,
            data   : exists ? response.data : null,
        }
    }
}

module.exports = new GitHub;

// Path: src/module/impl/username/github.ts
