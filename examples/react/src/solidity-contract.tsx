import { AccountGuard } from "./account-guard";
import { solidityStorage } from "./config";
import {
  useContractEventListener,
  useContractMutation,
  useLazyLoadQuery,
} from "@reactive-dot/react";
import { useState, useTransition } from "react";

export function SolidityContracts() {
  const [inTransition, startTransition] = useTransition();
  const [fetchKey, setFetchKey] = useState(0);
  const value = useLazyLoadQuery(
    (builder) =>
      builder.contract(
        solidityStorage,
        "0xF919bfbEa8f4Aad2126C7e2a4a91ba06c0cb1462",
        (builder) => builder.func("retrieve"),
      ),
    { fetchKey },
  );

  useContractEventListener(
    solidityStorage,
    "0xF919bfbEa8f4Aad2126C7e2a4a91ba06c0cb1462",
    "StorageSet",
    (event) => {
      if (event.data.newValue !== value) {
        startTransition(() => setFetchKey((count) => count + 1));
      }
    },
  );

  return (
    <article>
      Stored number: {value.toString()} {inTransition && `(updating)`}
      <AccountGuard>
        <ValueSetter />
      </AccountGuard>
    </article>
  );
}

function ValueSetter() {
  const [value, setValue] = useState("");
  const [_, submit] = useContractMutation((mutate, value: bigint) =>
    mutate(
      solidityStorage,
      "0xF919bfbEa8f4Aad2126C7e2a4a91ba06c0cb1462",
      "store",
      { args: [value] },
    ),
  );

  return (
    <label>
      New Number:
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="button" onClick={() => submit({ input: BigInt(value) })}>
        Submit
      </button>
    </label>
  );
}
