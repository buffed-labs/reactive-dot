import * as exports from "./index.js";
import { expect, it } from "vitest";

it("should match inline snapshot", () =>
  expect(Object.keys(exports)).toMatchInlineSnapshot(`
    [
      "whenAccountsChanged",
      "whenConnectedWalletsChanged",
      "whenWalletsChanged",
      "defineConfig",
      "defineContract",
      "BaseError",
      "MutationError",
      "QueryError",
      "ReactiveDotError",
      "Query",
      "Storage",
      "idle",
      "pending",
      "unsafeDescriptor",
    ]
  `));
