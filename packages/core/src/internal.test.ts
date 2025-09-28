import * as exports from "./internal.js";
import { expect, it } from "vitest";

it("should match inline snapshot", () =>
  expect(Object.keys(exports)).toMatchInlineSnapshot(`
    [
      "InkContract",
      "SolidityContract",
      "getSolidityContractTx",
      "flatHead",
      "nativeTokenInfoFromChainSpecData",
      "omit",
      "stringify",
      "toObservable",
    ]
  `));
