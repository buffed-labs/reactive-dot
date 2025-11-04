import { AccountGuard } from "./account-guard.js";
import { flipper, psp22 } from "./config.js";
import { pending } from "@reactive-dot/core";
import {
  useContractEventListener,
  useContractMutation,
  useLazyLoadQuery,
} from "@reactive-dot/react";
import { useState, useTransition } from "react";

export function InkContracts() {
  return (
    <section>
      <Psp22TokenInfo address="0xE7Fc69D1cE67F2902845F5Ffd2b454597ded5547" />
      <Flipper address="0xdeb2d925a5848fce3f296d329ac09a403c24fa4a" />
    </section>
  );
}

type ContractProps = {
  address: string;
};

function Psp22TokenInfo({ address }: ContractProps) {
  const [timestamp, [tokenName, tokenDecimals, tokenSymbol, totalSupply]] =
    useLazyLoadQuery((builder) =>
      builder
        .storage("Timestamp", "Now")
        .contract(psp22, address, (builder) =>
          builder
            .message("PSP22Metadata::token_name")
            .message("PSP22Metadata::token_decimals")
            .message("PSP22Metadata::token_symbol")
            .message("PSP22::total_supply"),
        ),
    );

  return (
    <article>
      <h3>PSP22</h3>
      <dl>
        <dt>Timestamp</dt>
        <dd>{new Date(Number(timestamp)).toLocaleString()}</dd>

        <dt>Token name</dt>
        <dd>{tokenName ?? "N/A"}</dd>

        <dt>Token symbol</dt>
        <dd>{tokenSymbol}</dd>

        <dt>Token decimals</dt>
        <dd>{tokenDecimals}</dd>

        <dt>Total supply</dt>
        <dd>{totalSupply.toLocaleString()}</dd>
      </dl>
    </article>
  );
}

function Flipper({ address }: ContractProps) {
  const [inTransition, startTransition] = useTransition();
  const [fetchKey, setFetchKey] = useState(0);

  const flipped = useLazyLoadQuery(
    (builder) =>
      builder.contract(flipper, address, (builder) => builder.message("get")),
    { fetchKey },
  );

  useContractEventListener(flipper, address, "Flipped", (event) => {
    if (event.data.new_value !== flipped) {
      startTransition(() => setFetchKey((count) => count + 1));
    }
  });

  return (
    <article>
      <h3>Flipper</h3>
      <p>
        Flipped: {flipped ? "true" : "false"} {inTransition && `(updating)`}
      </p>
      <AccountGuard>
        <Flip address={address} />
      </AccountGuard>
    </article>
  );
}

type FlipProps = ContractProps;

function Flip({ address }: FlipProps) {
  const [flipStatus, flip] = useContractMutation((mutate) =>
    mutate(flipper, address, "flip"),
  );

  return (
    <button
      type="button"
      onClick={() => flip()}
      disabled={flipStatus === pending}
    >
      {flipStatus === pending ? "Flipping" : "Flip"}
    </button>
  );
}
