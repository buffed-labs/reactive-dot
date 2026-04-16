import { BaseError } from "../../errors.js";
import type { InkContract } from "../contract.js";
import type { ContractCompatApi } from "../types.js";
import { getInkClient } from "./get-ink-client.js";
import { watchInkContractEvent } from "./watch-event.js";
import { Subject, firstValueFrom } from "rxjs";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

vi.mock("./get-ink-client.js", () => ({
  getInkClient: vi.fn(),
}));

const mockContract = {
  descriptor: {
    metadata: {
      spec: {
        events: [
          { label: "Event1", signature_topic: "0x1111" },
          { label: "Event2", signature_topic: "0x2222" },
          { label: "EventWithoutTopic" },
        ],
      },
    },
    __types: {
      event: { type: "Event1" },
    },
  },
} as unknown as InkContract;

interface MockBlockEvents {
  block: unknown;
  events: Array<{
    payload: {
      contract: string;
      data: Uint8Array;
      topics: string[];
    };
  }>;
}

const contractEmitted$ = new Subject<MockBlockEvents>();
const mockApi = {
  event: {
    Revive: {
      ContractEmitted: {
        watch: vi.fn().mockReturnValue(contractEmitted$.asObservable()),
      },
    },
  },
} as unknown as ContractCompatApi;

const mockInkClient = {
  event: {
    decode: vi.fn(),
  },
};

beforeEach(() => {
  vi.mocked(getInkClient).mockResolvedValue(mockInkClient as never);
});

afterEach(() => {
  vi.clearAllMocks();
});

it("throws an error if event does not have a signature topic", () => {
  expect(() =>
    watchInkContractEvent(mockApi, mockContract, undefined, "EventWithoutTopic"),
  ).toThrow(new BaseError("Event EventWithoutTopic does not have a signature topic"));
});

it("watches for events and decodes them", async () => {
  const address = "0x1234";
  const eventName = "Event1";
  const signatureTopic = "0x1111";

  const watch$ = watchInkContractEvent(mockApi, mockContract, address, eventName);

  const eventPromise = firstValueFrom(watch$);

  const decodedEvent = {
    type: "Event1",
    value: { data: "decoded" },
  };
  mockInkClient.event.decode.mockReturnValue(decodedEvent);

  await new Promise<void>((resolve) => setTimeout(resolve));

  contractEmitted$.next({
    block: "0xblock",
    events: [
      {
        payload: {
          contract: address,
          data: new Uint8Array(),
          topics: [signatureTopic],
        },
      },
    ],
  });

  const result = await eventPromise;

  expect(getInkClient).toHaveBeenCalledWith(mockContract);
  expect(mockApi.event.Revive.ContractEmitted.watch).toHaveBeenCalled();
  expect(mockInkClient.event.decode).toHaveBeenCalledWith(expect.anything(), signatureTopic);
  expect(result).toEqual({
    block: "0xblock",
    contract: address,
    name: "Event1",
    data: { data: "decoded" },
  });
});

it("filters events by contract address", async () => {
  const address = "0x1234";
  const otherAddress = "0x5678";
  const eventName = "Event1";
  const signatureTopic = "0x1111";

  const watch$ = watchInkContractEvent(mockApi, mockContract, address, eventName);

  const decodedEvent = {
    type: "Event1",
    value: { data: "decoded" },
  };
  mockInkClient.event.decode.mockReturnValue(decodedEvent);

  const receivedEvents: unknown[] = [];
  watch$.subscribe((e) => receivedEvents.push(e));

  await new Promise<void>((resolve) => setTimeout(resolve));

  // Emit a block with events from both contracts
  contractEmitted$.next({
    block: "0xblock",
    events: [
      {
        payload: {
          contract: otherAddress,
          data: new Uint8Array(),
          topics: [signatureTopic],
        },
      },
      {
        payload: {
          contract: address,
          data: new Uint8Array(),
          topics: [signatureTopic],
        },
      },
    ],
  });

  // Only the event from the correct contract should be received
  expect(receivedEvents).toHaveLength(1);
  expect(receivedEvents[0]).toEqual(expect.objectContaining({ contract: address }));
});

it("does not filter by address if address is undefined", async () => {
  const eventName = "Event1";
  const signatureTopic = "0x1111";

  const watch$ = watchInkContractEvent(mockApi, mockContract, undefined, eventName);

  const decodedEvent = {
    type: "Event1",
    value: { data: "decoded" },
  };
  mockInkClient.event.decode.mockReturnValue(decodedEvent);

  const receivedEvents: unknown[] = [];
  watch$.subscribe((e) => receivedEvents.push(e));

  await new Promise<void>((resolve) => setTimeout(resolve));

  contractEmitted$.next({
    block: "0xblock",
    events: [
      {
        payload: {
          contract: "0xanyaddress",
          data: new Uint8Array(),
          topics: [signatureTopic],
        },
      },
    ],
  });

  // Event from any contract should be received when address is undefined
  expect(receivedEvents).toHaveLength(1);
});

it("filters events by signature topic", async () => {
  const address = "0x1234";
  const eventName = "Event1";
  const signatureTopic = "0x1111";
  const otherSignatureTopic = "0x9999";

  const watch$ = watchInkContractEvent(mockApi, mockContract, address, eventName);

  const decodedEvent = {
    type: "Event1",
    value: { data: "decoded" },
  };
  mockInkClient.event.decode.mockReturnValue(decodedEvent);

  const receivedEvents: unknown[] = [];
  watch$.subscribe((e) => receivedEvents.push(e));

  await new Promise<void>((resolve) => setTimeout(resolve));

  // Emit a block with an event with wrong topic and correct topic
  contractEmitted$.next({
    block: "0xblock",
    events: [
      {
        payload: {
          contract: address,
          data: new Uint8Array(),
          topics: [otherSignatureTopic],
        },
      },
      {
        payload: {
          contract: address,
          data: new Uint8Array(),
          topics: [signatureTopic],
        },
      },
    ],
  });

  // Only the event with the correct signature topic should be received
  expect(receivedEvents).toHaveLength(1);
});
