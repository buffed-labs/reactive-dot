export const wellknownChains = {
  polkadot: [
    () => import("polkadot-api/chains/polkadot"),
    {
      polkadot_asset_hub: () =>
        import("polkadot-api/chains/polkadot_asset_hub"),
      polkadot_bridge_hub: () =>
        import("polkadot-api/chains/polkadot_bridge_hub"),
      polkadot_collectives: () =>
        import("polkadot-api/chains/polkadot_collectives"),
      polkadot_coretime: () => import("polkadot-api/chains/polkadot_coretime"),
      polkadot_people: () => import("polkadot-api/chains/polkadot_people"),
    },
  ],
  kusama: [
    () => import("polkadot-api/chains/kusama"),
    {
      kusama_asset_hub: () => import("polkadot-api/chains/kusama_asset_hub"),
      kusama_bridge_hub: () => import("polkadot-api/chains/kusama_bridge_hub"),
      kusama_encointer: () => import("polkadot-api/chains/kusama_encointer"),
      kusama_people: () => import("polkadot-api/chains/kusama_people"),
    },
  ],
  paseo: [
    () => import("polkadot-api/chains/paseo"),
    {
      paseo_asset_hub: () => import("polkadot-api/chains/paseo_asset_hub"),
      paseo_people: () => import("polkadot-api/chains/paseo_people"),
    },
  ],
  westend: [
    () => import("polkadot-api/chains/westend"),
    {
      westend_asset_hub: () => import("polkadot-api/chains/westend_asset_hub"),
      westend_bridge_hub: () =>
        import("polkadot-api/chains/westend_bridge_hub"),
      westend_collectives: () =>
        import("polkadot-api/chains/westend_collectives"),
      westend_people: () => import("polkadot-api/chains/westend_people"),
    },
  ],
} as const;

export type WellknownRelayChainId = keyof typeof wellknownChains;

type KeysOfUnion<T> = T extends T ? keyof T : never;

export type WellknownParachainId = KeysOfUnion<
  (typeof wellknownChains)[WellknownRelayChainId][1]
>;
