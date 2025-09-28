import { AccountGuard } from "./account-guard";
import { solidityStorage } from "./config";
import { useContractMutation, useLazyLoadQuery } from "@reactive-dot/react";
import { useEffect, useState, useTransition } from "react";

export function SolidityContracts() {
  const [inTransition, startTransition] = useTransition();
  const [fetchKey, setFetchKey] = useState(0);
  const value = useLazyLoadQuery(
    (builder) =>
      builder.contract(
        solidityStorage,
        "0xf9643E033D4210b477C6b47A8c5d21a275eE42C8",
        (builder) => builder.func("retrieve"),
      ),
    { fetchKey },
  );

  return (
    <article>
      Stored number: {value.toString()} {inTransition && `(updating)`}
      <AccountGuard>
        <ValueSetter
          onSet={() => {
            startTransition(() => setFetchKey((count) => count + 1));
          }}
        />
      </AccountGuard>
    </article>
  );
}

function ValueSetter({ onSet }: { onSet: () => void }) {
  const [value, setValue] = useState("");
  const [submitStatus, submit] = useContractMutation((mutate, value: bigint) =>
    mutate(
      solidityStorage,
      "0xf9643E033D4210b477C6b47A8c5d21a275eE42C8",
      "store",
      { args: [value] },
    ),
  );

  useEffect(() => {
    if (
      typeof submitStatus !== "symbol" &&
      !(submitStatus instanceof Error) &&
      submitStatus.type === "finalized"
    ) {
      onSet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitStatus]);

  return (
    <label>
      New Number:
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        type="button"
        onClick={() => submit({ variables: BigInt(value) })}
      >
        Submit
      </button>
    </label>
  );
}
