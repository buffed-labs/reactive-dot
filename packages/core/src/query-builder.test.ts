import { defineContract } from "./contract/contract.js";
import type { InkQuery } from "./contract/ink/query-builder.js";
import type { GenericInkDescriptors } from "./contract/ink/types.js";
import { Query } from "./query-builder.js";
import { expect, it } from "vitest";

it("should append a constant instruction", () => {
  const query = new Query();
  const newQuery = query.constant("TestPallet", "TestConstant");
  const instructions = newQuery.instructions;

  expect(instructions).toHaveLength(1);
  expect(instructions[0]).toEqual({
    type: "constant",
    pallet: "TestPallet",
    constant: "TestConstant",
    directives: {
      defer: undefined,
    },
  });
});

it("should append a storage instruction", () => {
  const query = new Query();
  const newQuery = query.storage("TestPallet", "TestStorage", ["arg1"], {
    at: "finalized",
  });
  const instructions = newQuery.instructions;

  expect(instructions).toHaveLength(1);
  expect(instructions[0]).toMatchInlineSnapshot(`
    {
      "at": "finalized",
      "directives": {
        "defer": undefined,
      },
      "keys": [
        "arg1",
      ],
      "pallet": "TestPallet",
      "storage": "TestStorage",
      "type": "storage",
    }
  `);
});

it("should append a multi storage instruction using storages", () => {
  const query = new Query();
  const newQuery = query.storages("TestPallet", "TestStorage", [
    ["arg1"],
    ["arg2"],
  ]);
  const instructions = newQuery.instructions;

  expect(instructions).toHaveLength(1);
  expect(instructions[0]).toMatchInlineSnapshot(`
    {
      "at": undefined,
      "directives": {
        "defer": undefined,
        "stream": undefined,
      },
      "keys": [
        [
          "arg1",
        ],
        [
          "arg2",
        ],
      ],
      "multi": true,
      "pallet": "TestPallet",
      "storage": "TestStorage",
      "type": "storage",
    }
  `);
});

it("should append a storage-entries instruction", () => {
  const query = new Query();
  const newQuery = query.storageEntries("TestPallet", "TestStorage", ["arg1"], {
    at: "best",
  });
  const instructions = newQuery.instructions;

  expect(instructions).toHaveLength(1);
  expect(instructions[0]).toMatchInlineSnapshot(`
    {
      "args": [
        "arg1",
      ],
      "at": "best",
      "directives": {
        "defer": undefined,
      },
      "pallet": "TestPallet",
      "storage": "TestStorage",
      "type": "storage-entries",
    }
  `);
});

it("should append a runtime-api instruction", () => {
  const query = new Query();
  const newQuery = query.runtimeApi("TestPallet", "TestApi", ["arg1"], {
    at: "best",
  });
  const instructions = newQuery.instructions;

  expect(instructions).toHaveLength(1);
  expect(instructions[0]).toMatchInlineSnapshot(`
    {
      "api": "TestPallet",
      "args": [
        "arg1",
      ],
      "at": "best",
      "directives": {
        "defer": undefined,
      },
      "method": "TestApi",
      "type": "runtime-api",
    }
  `);
});

it("should append a multi runtime-api instruction using runtimeApis", () => {
  const query = new Query();
  const newQuery = query.runtimeApis(
    "TestPallet",
    "TestApi",
    [["arg1"], ["arg2"]],
    { at: "finalized" },
  );
  const instructions = newQuery.instructions;

  expect(instructions).toHaveLength(1);
  expect(instructions[0]).toMatchInlineSnapshot(`
    {
      "api": "TestPallet",
      "args": [
        [
          "arg1",
        ],
        [
          "arg2",
        ],
      ],
      "at": "finalized",
      "directives": {
        "defer": undefined,
        "stream": undefined,
      },
      "method": "TestApi",
      "multi": true,
      "type": "runtime-api",
    }
  `);
});

const mockContractDescriptor = {} as unknown as GenericInkDescriptors;

const mockContract = defineContract({
  id: "mock-contract",
  type: "ink",
  descriptor: mockContractDescriptor,
});

const mockInkQueryBuilder = (
  query: InkQuery<typeof mockContractDescriptor, []>,
) => {
  return query.message("testMessage", {});
};

it("should append a contract instruction", () => {
  const query = new Query();
  const newQuery = query.contract(
    mockContract,
    "contractAddress123",
    mockInkQueryBuilder,
  );
  const instructions = newQuery.instructions;

  expect(instructions).toHaveLength(1);
  expect(instructions[0]).toMatchInlineSnapshot(`
    {
      "address": "contractAddress123",
      "contract": InkContract {
        "descriptor": {},
        "id": "mock-contract",
      },
      "directives": {
        "defer": undefined,
      },
      "instructions": [
        {
          "at": undefined,
          "body": {},
          "directives": {
            "defer": undefined,
          },
          "name": "testMessage",
          "origin": undefined,
          "type": "message",
        },
      ],
      "type": "contract",
    }
  `);
});

it("should append a multi contract instruction using contracts", () => {
  const query = new Query();
  const newQuery = query.contracts(
    mockContract,
    ["address1", "address2"],
    mockInkQueryBuilder,
  );
  const instructions = newQuery.instructions;

  expect(instructions).toHaveLength(1);
  expect(instructions[0]).toMatchInlineSnapshot(`
    {
      "addresses": [
        "address1",
        "address2",
      ],
      "contract": InkContract {
        "descriptor": {},
        "id": "mock-contract",
      },
      "directives": {
        "defer": undefined,
        "stream": undefined,
      },
      "instructions": [
        {
          "at": undefined,
          "body": {},
          "directives": {
            "defer": undefined,
          },
          "name": "testMessage",
          "origin": undefined,
          "type": "message",
        },
      ],
      "multi": true,
      "type": "contract",
    }
  `);
});

it("should return a frozen instructions array", () => {
  const query = new Query();
  const instructions = query.instructions;

  expect(Object.isFrozen(instructions)).toBe(true);
});

it("should concatenate two queries", () => {
  const query1 = new Query().constant("TestPallet", "TestConstant");
  const query2 = new Query().storage("TestPallet", "TestStorage", []);
  const query3 = new Query().runtimeApi("TestPallet", "TestApi", []);

  const concatenated = query1.concat(query2, query3);
  const instructions = concatenated.instructions;

  expect(instructions).toHaveLength(3);
  expect(instructions[0]).toMatchObject({
    type: "constant",
    pallet: "TestPallet",
    constant: "TestConstant",
  });
  expect(instructions[1]).toMatchObject({
    type: "storage",
    pallet: "TestPallet",
    storage: "TestStorage",
  });
  expect(instructions[2]).toMatchObject({
    type: "runtime-api",
    api: "TestPallet",
    method: "TestApi",
  });
});
