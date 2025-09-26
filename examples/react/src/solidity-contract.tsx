import { solidityStorage } from "./config";
import { useLazyLoadQuery } from "@reactive-dot/react";

export function SolidityContracts() {
  const value = useLazyLoadQuery((builder) =>
    builder.contract(
      solidityStorage,
      "0xf9643E033D4210b477C6b47A8c5d21a275eE42C8",
      (builder) => builder.func("retrieve"),
    ),
  );

  return <article>Stored number: {value.toString()}</article>;
}
