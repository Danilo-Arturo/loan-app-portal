import { readFileSync } from "node:fs";
import type { Application, ApplicationResponse } from "./types.js";
//NodeNext expects this convention for compiled ES modules, ensuring that the correct file is imported during runtime. This is particularly important when working with TypeScript, as it compiles to JavaScript and the module resolution needs to be explicit to avoid ambiguity.

export const applications: Application[] = JSON.parse(
  readFileSync(
    new URL("../data/applications.json", import.meta.url),
    "utf8"
  )
);

export const responses: ApplicationResponse[] = JSON.parse(
    readFileSync(
        new URL("../data/responses.json", import.meta.url),
        "utf8"
    )
);
