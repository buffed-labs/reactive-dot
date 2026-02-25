import { defineContract } from "../contract.js";
import type { ContractCompatApi } from "../types.js";
import { watchSolidityContractEvent } from "./watch-event.js";
import { AbiEvent } from "ox";
import { Binary, type SizedHex } from "polkadot-api";
import { lastValueFrom, Subject, toArray } from "rxjs";
import { beforeEach, expect, it, vi } from "vitest";

const transferEvent = AbiEvent.from(
  "event Transfer(address indexed from, address indexed to, uint256 value)",
);

const bsEvent = AbiEvent.from("event Bs(address indexed clown)");

let eventSubject = new Subject<{
  block: unknown;
  events: Array<{
    payload: {
      contract: SizedHex<20>;
      data: Uint8Array;
      topics: SizedHex<32>[];
    };
  }>;
}>();

const mockApi = {
  event: {
    Revive: {
      ContractEmitted: {
        watch: vi.fn(() => eventSubject.asObservable()),
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
  eventSubject = new Subject();
});

it("filters the right events", async () => {
  const { topics: transferEventTopics } = AbiEvent.encode(transferEvent, {
    from: "0xC791486a99fB038A63ff51622A879c53EE4EA9ac",
    to: "0xE94c9f9A1893f23be38A5C0394E46Ac05e8a5f8C",
  });

  const { topics: bsEventTopics } = AbiEvent.encode(bsEvent, {
    clown: "0xC791486a99fB038A63ff51622A879c53EE4EA9ac",
  });

  const subscription = watchSolidityContractEvent(
    mockApi,
    mockContract,
    "0x",
    "Transfer",
  );

  const resultPromise = lastValueFrom(subscription.pipe(toArray()));

  // Wait for defer(() => import("ox")) to resolve
  await new Promise((r) => setTimeout(r, 0));

  const dataHex =
    "0x12342235243524123421342131324123421412341324124123412341234123412343231";

  eventSubject.next({
    block: {},
    events: [
      {
        payload: {
          contract: "0x" as SizedHex<20>,
          data: Binary.fromHex(dataHex),
          topics: firstValidTopics(transferEventTopics),
        },
      },
    ],
  });

  eventSubject.next({
    block: {},
    events: [
      {
        payload: {
          contract: "0x" as SizedHex<20>,
          data: Binary.fromHex(dataHex),
          topics: firstValidTopics(bsEventTopics),
        },
      },
    ],
  });

  eventSubject.next({
    block: {},
    events: [
      {
        payload: {
          contract: "0x" as SizedHex<20>,
          data: Binary.fromHex(dataHex),
          topics: firstValidTopics(transferEventTopics),
        },
      },
    ],
  });

  eventSubject.complete();

  expect(await resultPromise).toMatchInlineSnapshot(`
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

  const subscription = watchSolidityContractEvent(
    mockApi,
    mockContract,
    "0x123456",
    "Transfer",
  );

  const resultPromise = lastValueFrom(subscription.pipe(toArray()));

  // Wait for defer(() => import("ox")) to resolve
  await new Promise((r) => setTimeout(r, 0));

  const dataHex =
    "0x12342235243524123421342131324123421412341324124123412341234123412343231";

  eventSubject.next({
    block: {},
    events: [
      {
        payload: {
          contract: "0x123456" as SizedHex<20>,
          data: Binary.fromHex(dataHex),
          topics: firstValidTopics(transferEventTopics),
        },
      },
    ],
  });

  eventSubject.next({
    block: {},
    events: [
      {
        payload: {
          contract: "0x678910" as SizedHex<20>,
          data: Binary.fromHex(dataHex),
          topics: firstValidTopics(transferEventTopics),
        },
      },
    ],
  });

  eventSubject.next({
    block: {},
    events: [
      {
        payload: {
          contract: "0x123456" as SizedHex<20>,
          data: Binary.fromHex(dataHex),
          topics: firstValidTopics(transferEventTopics),
        },
      },
    ],
  });

  eventSubject.complete();

  expect(await resultPromise).toMatchInlineSnapshot(`
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
  const topicToHex = (topic: `0x${string}` | null): SizedHex<32> =>
    topic === null
      ? (Binary.toHex(new Uint8Array()) as SizedHex<32>)
      : (topic as SizedHex<32>);

  return topics.map((topic) =>
    topic === null || typeof topic === "string"
      ? topicToHex(topic)
      : topicToHex(topic.at(0)!),
  );
}
