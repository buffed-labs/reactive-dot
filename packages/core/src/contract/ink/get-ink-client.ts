import {
  getContractConfig,
  type InkContract,
} from "../../contract/contract.js";

export function getInkClient(contract: InkContract) {
  return import("polkadot-api/ink").then(({ getInkClient }) =>
    getInkClient(getContractConfig(contract).descriptor),
  );
}
