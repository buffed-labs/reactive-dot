import * as exports from "./internal.js";
import { expect, it } from "vitest";

it("should match inline snapshot", () =>
  expect(Object.keys(exports)).toMatchInlineSnapshot(`
    [
      "toSs58String",
      "InkContract",
      "SolidityContract",
      "getSolidityContractTx",
      "watchContractEvent",
      "extractPolkadotSigner",
      "UnsafeDescriptor",
      "flatHead",
      "nativeTokenInfoFromChainSpecData",
      "omit",
      "stringify",
      "toObservable",
    ]
  `));
