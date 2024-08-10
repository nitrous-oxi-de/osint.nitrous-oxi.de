
# api.nitrous-oxi.de

Fastify [REST API](https://api.nitrous-oxi.de/) featured with an OSINT framework for basic reconnaissance.


![GitHub License](https://img.shields.io/github/license/nitrous-oxi-de/api.nitrous-oxi.de)

## Usage

### Categories

- [`/username`](https://api.nitrous-oxi.de/username)
- [`/domain`](https://api.nitrous-oxi.de/domain)
- [`/email`](https://api.nitrous-oxi.de/email)
- [`/phone`](https://api.nitrous-oxi.de/phone)
- [`/ip`](https://api.nitrous-oxi.de/ip)

### Module Indexing

All modules can be indexed via the following endpoints:

- `https://api.nitrous-oxi.de/`
- `https://api.nitrous-oxi.de/<category>/`

### Individual Module Queries

A single module can be queried via the following endpoint:

- `https://api.nitrous-oxi.de/<category>/<module>?query=`

### Categorized Queries

All modules within a category can be queried via the following endpoints:

- `https://api.nitrous-oxi.de/<category>?query=`

### Response Schema

```json
{ "status" : 200, "data" : {} }
{ "status" : 404, "data" : null }
{ "status" : 500, "data" : null }
```


## Contributing

Contributions are always welcome, espcially in the form of new modules! For major changes, please open an issue first
to discuss what you would like to change.

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.


## Requirements

- Python 3.10
- Node.js v20
## Installation

Clone the repository then install dependencies via npm

```bash
npm install typescript -G
git clone https://github.com/NitrousSL/api.nitrous-oxi.de.git
cd api.nitrous-oxi.de
npm install
npm run start
```
    
## Development

### ModuleCategory Enum

Found in `src/sdk/enum/eModuleCategory.ts` aliased as `@enum/eModuleCategory`.

```typescript
export enum ModuleCategory {
    Username = 'username',
    Phone    = 'phone',
    Email    = 'email',
    IP       = 'ip',
    Domain   = 'domain',
}
```

Each module must be assigned a category, which describes its required input.

### ModuleType Enum

Found in `src/sdk/enum/eModuleType.ts` aliased as `@enum/eModuleType`.

```typescript
export enum ModuleType {
    Enrichment = 'enrichment',
    Existence  = 'existence',
}
```

Each module must be assigned a type, which is used to describe the data returned.

### ModuleMeta Interface

Found in `src/sdk/interface/iModuleMeta.ts` aliased as `@interface/iModuleMeta`.

```typescript
export interface ModuleMeta {
    name        : string;
    description : string;

    category    : ModuleCategory;
    type        : ModuleType;
}
```

Each module must be assigned metadata, which is used for indexing.

### Module Superclass

Found in `src/module/module.ts` aliased as `@module/module`.

```typescript
export class Module {

    public meta: ModuleMeta;

    constructor(meta: ModuleMeta) { this.meta = meta; }

    public async query(query: string): Promise<any> { throw new Error("Method not implemented."); }
}
```

Every module has a set metadata and must implement the `query` method, which returns a promise of the module's result.

### In Practice

Found in `src/module/impl/username/cashapp.ts`.

```typescript
// define our module's metadata
const META: ModuleMeta = {
    name        : "cashapp",
    description : "Searches for CashApp profile info based on a given username.",

    category    : ModuleCategory.Username,
    type        : ModuleType.Enrichment,
}

// create a new class extending our Module superclass
export class CashApp extends Module {

    // construct our class using our metadata
    constructor() { super(META); }

    public async query(query: string): Promise<any> {

        const response = await axios.get(`https://cash.app/$${query}`);

        // determine if the query has returned a valid response
        const exists = response.data.includes('var profile =');

        // parse the response and return data which is then sent to the client
        return {
            status : exists ? 200                                                                : 404,
            data   : exists ? JSON.parse(response.data.split('var profile = ')[1].split(';')[0]) : null,
        }
    }
}

// export a new instance of our module's class
module.exports = new CashApp;
```

### QueryStandardization Interface

Found in `src/sdk/interface/iQueryStandardization.ts` aliased as `@interface/iQueryStandardization`.

```typescript
export default interface IQueryStandardization {

    readonly category    : ModuleCategory;

    readonly minLength   : number;
    readonly maxLength   : number;

    readonly regex     ? : RegExp;
}
```

Provides category-specific query standardization to catch some common mistakes.

#### Example

Found in `src/module/query/domain.query.ts`.

```typescript
// create a new class implementing our interface
export default class DomainQuery implements IQueryStandardization {

    // define our category
    readonly category    : ModuleCategory = ModuleCategory.Domain;

    // define our query standardization
    readonly minLength   : number = 3;
    readonly maxLength   : number = 255;

    // optionally define a regex to match against
    readonly regex     ? : RegExp = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
}

// export a new instance of our class
module.exports = new DomainQuery;
```

The router will automatically standardize the query before passing it to the module and will return a 400 if the query does not meet the standardization requirements.

See the `doesQueryConform()` method and its usages in `src/route/osintRoute.ts` for more information.
## Acknowledgements

 - [GHunt](https://github.com/mxrch/GHunt)


## Repository Stats

![Alt](https://repobeats.axiom.co/api/embed/a71a1d11f2b51d2c389794c83f5153c18da80f24.svg "Repobeats analytics image")
## License

[GPL-3.0](https://choosealicense.com/licenses/gpl-3.0/)

