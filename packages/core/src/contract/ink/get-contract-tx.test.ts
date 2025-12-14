import { getInkContractTx } from "./get-contract-tx.js";
import type { PolkadotClient, PolkadotSigner } from "polkadot-api";
import { expect, it, vi } from "vitest";

function makeInkClient(mutates: boolean, encoded = "encodedData") {
  return {
    message: vi.fn((_name: string) => ({
      attributes: { mutates },
      encode: vi.fn(() => encoded),
    })),
  };
}

it("throws if message is readonly (mutates=false)", async () => {
  const inkClient = makeInkClient(false);

  await expect(
    getInkContractTx(
      {} as unknown as PolkadotClient,
      // @ts-expect-error api is mocked
      inkClient,
      {} as unknown as PolkadotSigner,
      "contractAddress",
      "someMessage",
      {},
    ),
  ).rejects.toThrow(
    `Readonly message someMessage cannot be used in a mutating transaction`,
  );
});
