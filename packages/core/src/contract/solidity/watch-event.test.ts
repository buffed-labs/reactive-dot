import { defineContract } from "../contract.js";
import type { ContractCompatApi } from "../types.js";
import { watchSolidityContractEvent } from "./watch-event.js";
import { AbiEvent } from "ox";
import { Binary, type FixedSizeBinary } from "polkadot-api";
import { filter, from, lastValueFrom, map, toArray } from "rxjs";
import { beforeEach, expect, it, vi } from "vitest";

const transferEvent = AbiEvent.from(
  "event Transfer(address indexed from, address indexed to, uint256 value)",
);

const bsEvent = AbiEvent.from("event Bs(address indexed clown)");

let eventSubject = from(
  [] as Array<{
    contract: FixedSizeBinary<20>;
    data: Binary;
    topics: FixedSizeBinary<32>[];
  }>,
);

const mockApi = {
  event: {
    Revive: {
      ContractEmitted: {
        watch: vi.fn((filterFn: (event: unknown) => boolean) =>
          eventSubject.pipe(
            filter(filterFn),
            map((event) => ({ meta: { block: {} }, payload: event })),
          ),
        ),
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

  eventSubject = from([
    {
      contract: Binary.fromHex("0x"),
      data: Binary.fromHex(
        "0x12342235243524123421342131324123421412341324124123412341234123412343231",
      ),
      topics: firstValidTopics(transferEventTopics),
    },
    {
      contract: Binary.fromHex("0x"),
      data: Binary.fromHex(
        "0x12342235243524123421342131324123421412341324124123412341234123412343231",
      ),
      topics: firstValidTopics(bsEventTopics),
    },
    {
      contract: Binary.fromHex("0x"),
      data: Binary.fromHex(
        "0x12342235243524123421342131324123421412341324124123412341234123412343231",
      ),
      topics: firstValidTopics(transferEventTopics),
    },
  ]);

  const subscription = watchSolidityContractEvent(
    mockApi,
    mockContract,
    "0x",
    "Transfer",
  );

  expect(await lastValueFrom(subscription.pipe(toArray())))
    .toMatchInlineSnapshot(`
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

  eventSubject = from([
    {
      contract: Binary.fromHex("0x123456"),
      data: Binary.fromHex(
        "0x12342235243524123421342131324123421412341324124123412341234123412343231",
      ),
      topics: firstValidTopics(transferEventTopics),
    },
    {
      contract: Binary.fromHex("0x678910"),
      data: Binary.fromHex(
        "0x12342235243524123421342131324123421412341324124123412341234123412343231",
      ),
      topics: firstValidTopics(transferEventTopics),
    },
    {
      contract: Binary.fromHex("0x123456"),
      data: Binary.fromHex(
        "0x12342235243524123421342131324123421412341324124123412341234123412343231",
      ),
      topics: firstValidTopics(transferEventTopics),
    },
  ]);

  const subscription = watchSolidityContractEvent(
    mockApi,
    mockContract,
    "0x123456",
    "Transfer",
  );

  expect(await lastValueFrom(subscription.pipe(toArray())))
    .toMatchInlineSnapshot(`
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
  topics: [
    selector: `0x${string}`,
    ...(`0x${string}` | readonly `0x${string}`[] | null)[],
  ],
) {
  const topicToBinary = (topic: `0x${string}` | null) =>
    topic === null
      ? (Binary.fromBytes(new Uint8Array()) as FixedSizeBinary<32>)
      : (Binary.fromHex(topic) as FixedSizeBinary<32>);

  return topics.map((topic) =>
    topic === null || typeof topic === "string"
      ? topicToBinary(topic)
      : topicToBinary(topic.at(0)!),
  );
}
