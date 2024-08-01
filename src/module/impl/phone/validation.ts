import { ModuleCategory } from "@enum/eModuleCategory";
import { ModuleType }     from "@enum/eModuleType";

import { ModuleMeta }     from "@interface/iModuleMeta";

import { Module }         from "@module/module";

import axios              from "axios";

const META: ModuleMeta = {
    name        : "validation",
    description : "Validates phone number and returns location info using API Ninjas.",
  
    thumbnail   : "",

    updatedAt   : "Sun Jun 30 2024",

    category    : ModuleCategory.Phone,
    type        : ModuleType.Enrichment,
}

const SANDBOX: any = {

}

export class Validation extends Module {

    constructor() { super(META, SANDBOX); }

    public async query(query: string): Promise<any> {

        const response = await axios.get(`https://api.api-ninjas.com/v1/validatephone?number=${query}`, {
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

module.exports = new Validation;

// Path: src/module/impl/domain/validation.ts
