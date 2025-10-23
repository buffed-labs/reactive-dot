import { useChainId, useLazyLoadQuery, usePromises } from "@reactive-dot/react";
import { useMemo } from "react";

export function MultichainQuery() {
  const chainId = useChainId();

  const parachainId = useMemo(() => {
    switch (chainId) {
      case "polkadot":
      case "polkadot_asset_hub":
      case "polkadot_people":
        return "polkadot_asset_hub";
      case "kusama":
      case "kusama_asset_hub":
        return "kusama_asset_hub";
      case "westend":
      case "westend_asset_hub":
        return "westend_asset_hub";
      default:
        return chainId;
    }
  }, [chainId]);

  const [parachains, assetHubParaId] = usePromises([
    useLazyLoadQuery((builder) => builder.storage("Paras", "Parachains"), {
      use: false,
    }),
    useLazyLoadQuery(
      (builder) => builder.storage("ParachainInfo", "ParachainId"),
      { chainId: parachainId, use: false },
    ),
  ]);

  return (
    <dl>
      <dt>Parachain IDs</dt>
      <dd>{parachains.join()}</dd>
      <dt>Asset Hub ID</dt>
      <dd>{assetHubParaId.toString()}</dd>
    </dl>
  );
}
