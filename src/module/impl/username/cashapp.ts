/*
 * @file cashapp.ts
 * @author David @dvhsh (https://dvh.sh)
 * @updated Thu Aug 9 2024
 * @description CashApp username module
 */
import { ModuleCategory } from "@enum/eModuleCategory";
import { ModuleType }     from "@enum/eModuleType";

import { ModuleMeta }     from "@interface/iModuleMeta";

import { Module }         from "@module/module";

import axios              from "axios";

const META: ModuleMeta = {
    name        : "cashapp",
    description : "Searches for CashApp profile info based on a given username.",

    thumbnail   : "",

    updatedAt   : "Sun Jun 30 2024",

    category    : ModuleCategory.Username,
    type        : ModuleType.Enrichment,
}

const SANDBOX: any = {

}

export class CashApp extends Module {

    constructor() { super(META, SANDBOX); }

    public async query(query: string): Promise<any> {

        const response = await axios.get(`https://cash.app/$${query}`);

        const exists = response.data.includes('var profile =');

        return {
            status : exists ? 200                                                                : 404,
            data   : exists ? JSON.parse(response.data.split('var profile = ')[1].split(';')[0]) : null,
        }
    }
}

module.exports = new CashApp;

// Path: src/module/impl/username/cashapp.ts
