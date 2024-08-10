/*
 * @file dns.ts
 * @author David @dvhsh (https://dvh.sh)
 * @updated Thu Aug 9 2024
 * @description DNS domain module
 */
import { ModuleCategory } from "@enum/eModuleCategory";
import { ModuleType }     from "@enum/eModuleType";

import { ModuleMeta }     from "@interface/iModuleMeta";

import { Module }         from "@module/module";

import axios              from "axios";

const META: ModuleMeta = {
    name        : "dns",
    description : "Searches for DNS records within a given domain name using API Ninjas.",

    thumbnail   : "",

    updatedAt   : "Sun Jun 30 2024",

    category    : ModuleCategory.Domain,
    type        : ModuleType.Enrichment,
}

const SANDBOX: any = {
    "status" : 200,
    "data"   : [
        {
            "record_type" : "A",
            "value"       : "1.1.1.1",
        }
    ]
}

export class DNS extends Module {

    constructor() { super(META, SANDBOX); }

    public async query(query: string): Promise<any> {

        const response = await axios.get(`https://api.api-ninjas.com/v1/dnslookup?domain=${query}`, {
            headers: {
                'X-Api-Key': process.env.API_NINJAS_KEY as string
            }
        });

        const exists = response.data !== '';

        return {
            status : exists ? 200           : 404,
            data   : exists ? response.data : null,
        }
    }
}

module.exports = new DNS;

// Path: src/module/impl/domain/dns.ts
