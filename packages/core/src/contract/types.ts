/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { Address } from "../address.js";
import type {
  ApisTypedef,
  BlockInfo,
  Enum,
  PalletsTypedef,
  PlainDescriptor,
  ResultPayload,
  RuntimeDescriptor,
  SizedHex,
  SS58String,
  StorageDescriptor,
  TxDescriptor,
  TypedApi,
} from "polkadot-api";

export type ContractAddress = Address | SizedHex<20>;

export type ContractEvent<TName extends string = string, TData = unknown> = {
  block: BlockInfo;
  contract: Address;
  name: TName;
  data: TData;
};

export type Gas = {
  ref_time: bigint;
  proof_size: bigint;
};

export type StorageError = Enum<{
  DoesntExist: undefined;
  KeyDecodingFailed: undefined;
  MigrationInProgress: undefined;
}>;

export type ContractApis<TEvent = any, TError = any> = ApisTypedef<{
  ReviveApi: {
    /**
     * Perform a call from a specified account to a given contract.
     *
     * See [`crate::Pallet::bare_call`].
     */
    call: RuntimeDescriptor<
      [
        origin: SS58String,
        dest: SizedHex<20>,
        value: bigint,
        weight_limit: Gas | undefined,
        storage_deposit_limit: bigint | undefined,
        input_data: Uint8Array,
      ],
      {
        gas_consumed: bigint;
        weight_required: Gas;
        storage_deposit: Enum<{
          Refund: bigint;
          Charge: bigint;
        }>;
        result: ResultPayload<
          {
            flags: number;
            data: Uint8Array;
          },
          TError
        >;
        events?: Array<TEvent>;
      }
    >;
    /**
     * Query a given storage key in a given contract.
     *
     * Returns `Ok(Some(Vec<u8>))` if the storage value exists under the given key in the
     * specified account and `Ok(None)` if it doesn't. If the account specified by the address
     * doesn't exist, or doesn't have a contract then `Err` is returned.
     */
    get_storage: RuntimeDescriptor<
      [address: SizedHex<20>, key: SizedHex<32>],
      ResultPayload<
        Uint8Array | undefined,
        Enum<{
          DoesntExist: undefined;
          KeyDecodingFailed: undefined;
        }>
      >
    >;
    /**
     * Query a given variable-sized storage key in a given contract.
     *
     * Returns `Ok(Some(Vec<u8>))` if the storage value exists under the given key in the
     * specified account and `Ok(None)` if it doesn't. If the account specified by the address
     * doesn't exist, or doesn't have a contract then `Err` is returned.
     */
    get_storage_var_key: RuntimeDescriptor<
      [address: SizedHex<20>, key: Uint8Array],
      ResultPayload<
        Uint8Array | undefined,
        Enum<{
          DoesntExist: undefined;
          KeyDecodingFailed: undefined;
        }>
      >
    >;
  };
}>;

export type ContractPallets = PalletsTypedef<
  {
    Revive: {
      /**
       * A mapping from a contract's code hash to its code.
       */
      PristineCode: StorageDescriptor<
        [Key: SizedHex<32>],
        Uint8Array,
        true,
        never
      >;
      /**
       * A mapping from a contract's code hash to its code info.
       */
      CodeInfoOf: StorageDescriptor<
        [Key: SizedHex<32>],
        {
          owner: SS58String;
          deposit: bigint;
          refcount: bigint;
          code_len: number;
          behaviour_version: number;
        },
        true,
        never
      >;
      /**
       * The code associated with a given account.
       */
      ContractInfoOf: StorageDescriptor<
        [Key: SizedHex<20>],
        {
          trie_id: Uint8Array;
          code_hash: SizedHex<32>;
          storage_bytes: number;
          storage_items: number;
          storage_byte_deposit: bigint;
          storage_item_deposit: bigint;
          storage_base_deposit: bigint;
          immutable_data_len: number;
        },
        true,
        never
      >;
      /**
       * The immutable data associated with a given account.
       */
      ImmutableDataOf: StorageDescriptor<
        [Key: SizedHex<20>],
        Uint8Array,
        true,
        never
      >;
      /**
       * Evicted contracts that await child trie deletion.
       *
       * Child trie deletion is a heavy operation depending on the amount of storage items
       * stored in said trie. Therefore this operation is performed lazily in `on_idle`.
       */
      DeletionQueue: StorageDescriptor<[Key: number], Uint8Array, true, never>;
      /**
       * A pair of monotonic counters used to track the latest contract marked for deletion
       * and the latest deleted contract in queue.
       */
      DeletionQueueCounter: StorageDescriptor<
        [],
        {
          insert_counter: number;
          delete_counter: number;
        },
        false,
        never
      >;
      /**
       * Map a Ethereum address to its original `AccountId32`.
       *
       * Stores the last 12 byte for addresses that were originally an `AccountId32` instead
       * of an `H160`. Register your `AccountId32` using [`Pallet::map_account`] in order to
       * use it with this pallet.
       */
      AddressSuffix: StorageDescriptor<
        [Key: SizedHex<20>],
        SizedHex<12>,
        true,
        never
      >;
    };
  },
  {
    Revive: {
      call: TxDescriptor<{
        dest: SizedHex<20>;
        value: bigint;
        weight_limit: Gas;
        storage_deposit_limit: bigint;
        data: Uint8Array;
      }>;
    };
  },
  {
    Revive: {
      ContractEmitted: PlainDescriptor<{
        /**
         * The contract that emitted the event.
         */
        contract: SizedHex<20>;
        /**
         * Data supplied by the contract. Metadata generated during contract compilation
         * is needed to decode it.
         */
        data: Uint8Array;
        /**
         * A list of topics used to index the event.
         * Number of topics is capped by [`limits::NUM_EVENT_TOPICS`].
         */
        topics: SizedHex<32>[];
      }>;
    };
  },
  {},
  {},
  {}
>;

export type GenericDefinition<TPallet, TApis> = {
  descriptors: Promise<any> & {
    pallets: TPallet;
    apis: TApis;
  };
  asset: any;
  extensions?: Record<string, { value?: any; additionalSigned?: any }>;
  metadataTypes: any;
  getMetadata: any;
  genesis: any;
};

export type ContractCompatApi = TypedApi<
  GenericDefinition<ContractPallets, ContractApis>
>;
