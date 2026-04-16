import { defineContract } from "../contract.js";
import type { ContractCompatApi } from "../types.js";
import { watchSolidityContractEvent } from "./watch-event.js";
import { AbiEvent } from "ox";
import { Binary, type SizedHex } from "polkadot-api";
import { from, lastValueFrom, toArray } from "rxjs";
import { beforeEach, expect, it, vi } from "vitest";

const transferEvent = AbiEvent.from(
  "event Transfer(address indexed from, address indexed to, uint256 value)",
);

const bsEvent = AbiEvent.from("event Bs(address indexed clown)");

interface MockEvent {
  payload: {
    contract: SizedHex<20>;
    data: Uint8Array;
    topics: SizedHex<32>[];
  };
}

type MockBlock = Record<string, never>;

let eventSubject = from([] as Array<{ block: MockBlock; events: MockEvent[] }>);

const mockApi = {
  event: {
    Revive: {
      ContractEmitted: {
        watch: vi.fn(() => eventSubject),
      },
    },
  },
} as unknown as ContractCompatApi;

const mockContract = defineContract({
  type: "solidity",
  abi: [
    {
      name: "Transfer",
      type: "event",
      inputs: [
        { name: "from", type: "address", indexed: true },
        { name: "to", type: "address", indexed: true },
        { name: "value", type: "uint256" },
      ],
    },
  ],
});

beforeEach(() => {
  eventSubject = from([]);
});

it("filters the right events", async () => {
  const { topics: transferEventTopics } = AbiEvent.encode(transferEvent, {
    from: "0xC791486a99fB038A63ff51622A879c53EE4EA9ac",
    to: "0xE94c9f9A1893f23be38A5C0394E46Ac05e8a5f8C",
  });

  const { topics: bsEventTopics } = AbiEvent.encode(bsEvent, {
    clown: "0xC791486a99fB038A63ff51622A879c53EE4EA9ac",
  });

  const transferTopics = firstValidTopics(transferEventTopics);
  const bsTopics = firstValidTopics(bsEventTopics);
  const dataHex = "0x12342235243524123421342131324123421412341324124123412341234123412343231";
  const dataBytes = Binary.fromHex(dataHex);

  eventSubject = from([
    {
      block: {},
      events: [
        {
          payload: {
            contract: "0x" as SizedHex<20>,
            data: dataBytes,
            topics: transferTopics,
          },
        },
        {
          payload: {
            contract: "0x" as SizedHex<20>,
            data: dataBytes,
            topics: bsTopics,
          },
        },
        {
          payload: {
            contract: "0x" as SizedHex<20>,
            data: dataBytes,
            topics: transferTopics,
          },
        },
      ],
    },
  ]);

  const subscription = watchSolidityContractEvent(mockApi, mockContract, "0x", "Transfer");

  expect(await lastValueFrom(subscription.pipe(toArray()))).toMatchInlineSnapshot(`
    [
      {
        "block": {},
        "contract": "0x",
        "data": {
          "from": "0xc791486a99fb038a63ff51622a879c53ee4ea9ac",
          "to": "0xe94c9f9a1893f23be38a5c0394e46ac05e8a5f8c",
          "value": 514608963370833663343690880023784986173311683752824139358876593142705164852n,
        },
        "name": "Transfer",
      },
      {
        "block": {},
        "contract": "0x",
        "data": {
          "from": "0xc791486a99fb038a63ff51622a879c53ee4ea9ac",
          "to": "0xe94c9f9a1893f23be38a5c0394e46ac05e8a5f8c",
          "value": 514608963370833663343690880023784986173311683752824139358876593142705164852n,
        },
        "name": "Transfer",
      },
    ]
  `);
});

it("filters by contract address", async () => {
  const { topics: transferEventTopics } = AbiEvent.encode(transferEvent, {
    from: "0xC791486a99fB038A63ff51622A879c53EE4EA9ac",
    to: "0xE94c9f9A1893f23be38A5C0394E46Ac05e8a5f8C",
  });

  const transferTopics = firstValidTopics(transferEventTopics);
  const dataHex = "0x12342235243524123421342131324123421412341324124123412341234123412343231";
  const dataBytes = Binary.fromHex(dataHex);

  eventSubject = from([
    {
      block: {},
      events: [
        {
          payload: {
            contract: "0x123456" as SizedHex<20>,
            data: dataBytes,
            topics: transferTopics,
          },
        },
        {
          payload: {
            contract: "0x678910" as SizedHex<20>,
            data: dataBytes,
            topics: transferTopics,
          },
        },
        {
          payload: {
            contract: "0x123456" as SizedHex<20>,
            data: dataBytes,
            topics: transferTopics,
          },
        },
      ],
    },
  ]);

  const subscription = watchSolidityContractEvent(mockApi, mockContract, "0x123456", "Transfer");

  expect(await lastValueFrom(subscription.pipe(toArray()))).toMatchInlineSnapshot(`
    [
      {
        "block": {},
        "contract": "0x123456",
        "data": {
          "from": "0xc791486a99fb038a63ff51622a879c53ee4ea9ac",
          "to": "0xe94c9f9a1893f23be38a5c0394e46ac05e8a5f8c",
          "value": 514608963370833663343690880023784986173311683752824139358876593142705164852n,
        },
        "name": "Transfer",
      },
      {
        "block": {},
        "contract": "0x123456",
        "data": {
          "from": "0xc791486a99fb038a63ff51622a879c53ee4ea9ac",
          "to": "0xe94c9f9a1893f23be38a5c0394e46ac05e8a5f8c",
          "value": 514608963370833663343690880023784986173311683752824139358876593142705164852n,
        },
        "name": "Transfer",
      },
    ]
  `);
});

function firstValidTopics(
  topics: [selector: `0x${string}`, ...(`0x${string}` | readonly `0x${string}`[] | null)[]],
) {
  return topics.map((topic) =>
    topic === null || typeof topic === "string"
      ? (topic ?? ("0x" as SizedHex<32>))
      : ((topic.at(0) ?? "0x") as SizedHex<32>),
  ) as SizedHex<32>[];
}
