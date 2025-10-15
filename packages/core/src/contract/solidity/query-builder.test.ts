import { Query } from "../../query-builder.js";
import { defineContract } from "../contract.js";
import { expect, it } from "vitest";

it("matches snapshot", () => {
  const contract = defineContract({
    id: "test",
    type: "solidity",
    abi: [
      {
        name: "balanceOf",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
      },
      {
        name: "totalSupply",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "uint256" }],
      },
      {
        name: "transfer",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
          { name: "to", type: "address" },
          { name: "amount", type: "uint256" },
        ],
        outputs: [{ name: "", type: "bool" }],
      },
    ],
  });

  const query = new Query().contract(contract, "0x", (query) =>
    query
      .func("totalSupply")
      .func("balanceOf", ["0x"])
      .funcs("balanceOf", [["0x"], ["0x1"]]),
  );

  expect(query.instructions).toMatchInlineSnapshot(`
    [
      {
        "address": "0x",
        "contract": SolidityContract {
          "abi": [
            {
              "inputs": [
                {
                  "name": "account",
                  "type": "address",
                },
              ],
              "name": "balanceOf",
              "outputs": [
                {
                  "name": "",
                  "type": "uint256",
                },
              ],
              "stateMutability": "view",
              "type": "function",
            },
            {
              "inputs": [],
              "name": "totalSupply",
              "outputs": [
                {
                  "name": "",
                  "type": "uint256",
                },
              ],
              "stateMutability": "view",
              "type": "function",
            },
            {
              "inputs": [
                {
                  "name": "to",
                  "type": "address",
                },
                {
                  "name": "amount",
                  "type": "uint256",
                },
              ],
              "name": "transfer",
              "outputs": [
                {
                  "name": "",
                  "type": "bool",
                },
              ],
              "stateMutability": "nonpayable",
              "type": "function",
            },
          ],
          "id": "test",
        },
        "directives": {
          "defer": undefined,
        },
        "instructions": [
          {
            "args": [],
            "at": undefined,
            "directives": {
              "defer": undefined,
            },
            "type": "function",
            "name": "totalSupply",
          },
          {
            "args": [
              "0x",
            ],
            "at": undefined,
            "directives": {
              "defer": undefined,
            },
            "type": "function",
            "name": "balanceOf",
          },
          {
            "args": [
              [
                "0x",
              ],
              [
                "0x1",
              ],
            ],
            "at": undefined,
            "directives": {
              "defer": undefined,
              "stream": undefined,
            },
            "type": "function",
            "multi": true,
            "name": "balanceOf",
          },
        ],
        "type": "contract",
      },
    ]
  `);
});
