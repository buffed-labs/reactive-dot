import { chainIdKey } from "../keys.js";
import { withSetup } from "../test-utils.js";
import { useQuery } from "./use-query.js";
import {
  delay,
  mockedTypedApi,
  multiQueries,
  singleContractQuery,
  singleQuery,
  streamingQueries,
} from "@reactive-dot/test/tests/query.js";
import { describe, expect, it, vi } from "vitest";

await vi.hoisted(async () => {
  const { mockInternals } = await import("@reactive-dot/test/tests/query.js");
  mockInternals();
});

vi.mock("./use-typed-api.js", () => ({
  useTypedApiPromise: vi.fn(async () => mockedTypedApi),
}));

describe("useQuery", () => {
  it("fetches single queries", async () => {
    const { result } = withSetup(() => useQuery(singleQuery), {
      [chainIdKey]: "test-chain",
    });

    const data = (await result).data;

    expect(data.value).toMatchInlineSnapshot(`"test-value"`);
  });

  it("fetches single contract queries", async () => {
    const { result } = withSetup(() => useQuery(singleContractQuery), {
      [chainIdKey]: "test-chain",
    });

    const data = (await result).data;

    expect(data.value).toMatchInlineSnapshot(`
      [
        "contract-0x",
        {
          "directives": {
            "defer": undefined,
          },
          "type": "storage",
          "path": "",
        },
      ]
    `);
  });

  it("fetches multi queries", async () => {
    const { result } = withSetup(() => useQuery(multiQueries), {
      [chainIdKey]: "test-chain",
    });

    const data = (await result).data;

    expect(data.value).toMatchInlineSnapshot(`
      [
        "test-value",
        "storage-value-key",
        [
          "storage-value-key1",
          "storage-value-key2",
        ],
        "api-value-key",
        [
          "api-value-key1",
          "api-value-key2",
        ],
        [
          [
            "contract-0x",
            {
              "directives": {
                "defer": undefined,
              },
              "type": "storage",
              "path": "",
            },
          ],
          [
            "contract-0x",
            {
              "directives": {
                "defer": undefined,
              },
              "key": "test_key",
              "type": "storage",
              "path": "test_storage",
            },
          ],
          [
            [
              "contract-0x",
              {
                "directives": {
                  "defer": undefined,
                  "stream": undefined,
                },
                "key": "test_key1",
                "type": "storage",
                "path": "test_storage",
              },
            ],
            [
              "contract-0x",
              {
                "directives": {
                  "defer": undefined,
                  "stream": undefined,
                },
                "key": "test_key2",
                "type": "storage",
                "path": "test_storage",
              },
            ],
          ],
          [
            "contract-0x",
            {
              "body": {
                "data": "test-data",
              },
              "directives": {
                "defer": undefined,
              },
              "type": "message",
              "name": "test_message",
            },
          ],
          [
            [
              "contract-0x",
              {
                "body": {
                  "data": "test-data1",
                },
                "directives": {
                  "defer": undefined,
                  "stream": undefined,
                },
                "type": "message",
                "name": "test_message",
              },
            ],
            [
              "contract-0x",
              {
                "body": {
                  "data": "test-data2",
                },
                "directives": {
                  "defer": undefined,
                  "stream": undefined,
                },
                "type": "message",
                "name": "test_message",
              },
            ],
          ],
          [
            [
              "contract-0x",
              {
                "body": {
                  "data": "test-data1",
                },
                "directives": {
                  "defer": undefined,
                  "stream": undefined,
                },
                "type": "message",
                "name": "test_message",
              },
            ],
            [
              "contract-0x",
              {
                "body": {
                  "data": "test-data2",
                },
                "directives": {
                  "defer": undefined,
                  "stream": undefined,
                },
                "type": "message",
                "name": "test_message",
              },
            ],
          ],
        ],
        [
          [
            [
              "contract-0x",
              {
                "directives": {
                  "defer": undefined,
                },
                "type": "storage",
                "path": "",
              },
            ],
            [
              "contract-0x",
              {
                "directives": {
                  "defer": undefined,
                },
                "key": "test_key",
                "type": "storage",
                "path": "test_storage",
              },
            ],
            [
              [
                "contract-0x",
                {
                  "directives": {
                    "defer": undefined,
                    "stream": undefined,
                  },
                  "key": "test_key1",
                  "type": "storage",
                  "path": "test_storage",
                },
              ],
              [
                "contract-0x",
                {
                  "directives": {
                    "defer": undefined,
                    "stream": undefined,
                  },
                  "key": "test_key2",
                  "type": "storage",
                  "path": "test_storage",
                },
              ],
            ],
            [
              "contract-0x",
              {
                "body": {
                  "data": "test-data",
                },
                "directives": {
                  "defer": undefined,
                },
                "type": "message",
                "name": "test_message",
              },
            ],
            [
              [
                "contract-0x",
                {
                  "body": {
                    "data": "test-data1",
                  },
                  "directives": {
                    "defer": undefined,
                    "stream": undefined,
                  },
                  "type": "message",
                  "name": "test_message",
                },
              ],
              [
                "contract-0x",
                {
                  "body": {
                    "data": "test-data2",
                  },
                  "directives": {
                    "defer": undefined,
                    "stream": undefined,
                  },
                  "type": "message",
                  "name": "test_message",
                },
              ],
            ],
          ],
          [
            [
              "contract-0x",
              {
                "directives": {
                  "defer": undefined,
                },
                "type": "storage",
                "path": "",
              },
            ],
            [
              "contract-0x",
              {
                "directives": {
                  "defer": undefined,
                },
                "key": "test_key",
                "type": "storage",
                "path": "test_storage",
              },
            ],
            [
              [
                "contract-0x",
                {
                  "directives": {
                    "defer": undefined,
                    "stream": undefined,
                  },
                  "key": "test_key1",
                  "type": "storage",
                  "path": "test_storage",
                },
              ],
              [
                "contract-0x",
                {
                  "directives": {
                    "defer": undefined,
                    "stream": undefined,
                  },
                  "key": "test_key2",
                  "type": "storage",
                  "path": "test_storage",
                },
              ],
            ],
            [
              "contract-0x",
              {
                "body": {
                  "data": "test-data",
                },
                "directives": {
                  "defer": undefined,
                },
                "type": "message",
                "name": "test_message",
              },
            ],
            [
              [
                "contract-0x",
                {
                  "body": {
                    "data": "test-data1",
                  },
                  "directives": {
                    "defer": undefined,
                    "stream": undefined,
                  },
                  "type": "message",
                  "name": "test_message",
                },
              ],
              [
                "contract-0x",
                {
                  "body": {
                    "data": "test-data2",
                  },
                  "directives": {
                    "defer": undefined,
                    "stream": undefined,
                  },
                  "type": "message",
                  "name": "test_message",
                },
              ],
            ],
          ],
        ],
        [
          [
            "contract-0x",
            {
              "args": [
                "test-data",
              ],
              "directives": {
                "defer": undefined,
              },
              "type": "function",
              "name": "test_func",
            },
          ],
          [
            [
              "contract-0x",
              {
                "args": [
                  "test-data1",
                ],
                "directives": {
                  "defer": undefined,
                  "stream": undefined,
                },
                "type": "function",
                "name": "test_func",
              },
            ],
            [
              "contract-0x",
              {
                "args": [
                  "test-data2",
                ],
                "directives": {
                  "defer": undefined,
                  "stream": undefined,
                },
                "type": "function",
                "name": "test_func",
              },
            ],
          ],
        ],
        [
          [
            [
              "contract-0x",
              {
                "args": [
                  "test-data",
                ],
                "directives": {
                  "defer": undefined,
                },
                "type": "function",
                "name": "test_func",
              },
            ],
            [
              [
                "contract-0x",
                {
                  "args": [
                    "test-data1",
                  ],
                  "directives": {
                    "defer": undefined,
                    "stream": undefined,
                  },
                  "type": "function",
                  "name": "test_func",
                },
              ],
              [
                "contract-0x",
                {
                  "args": [
                    "test-data2",
                  ],
                  "directives": {
                    "defer": undefined,
                    "stream": undefined,
                  },
                  "type": "function",
                  "name": "test_func",
                },
              ],
            ],
          ],
          [
            [
              "contract-0x",
              {
                "args": [
                  "test-data",
                ],
                "directives": {
                  "defer": undefined,
                },
                "type": "function",
                "name": "test_func",
              },
            ],
            [
              [
                "contract-0x",
                {
                  "args": [
                    "test-data1",
                  ],
                  "directives": {
                    "defer": undefined,
                    "stream": undefined,
                  },
                  "type": "function",
                  "name": "test_func",
                },
              ],
              [
                "contract-0x",
                {
                  "args": [
                    "test-data2",
                  ],
                  "directives": {
                    "defer": undefined,
                    "stream": undefined,
                  },
                  "type": "function",
                  "name": "test_func",
                },
              ],
            ],
          ],
        ],
      ]
    `);
  });

  it("streams queries", async () => {
    const { result } = withSetup(() => useQuery(streamingQueries), {
      [chainIdKey]: "test-chain",
    });

    await vi.waitUntil(() => result.data.value !== undefined, {
      timeout: 10_000,
    });

    expect(result.data.value).toMatchInlineSnapshot(`
      [
        Symbol(pending),
        Symbol(pending),
        [
          Symbol(pending),
          Symbol(pending),
        ],
        Symbol(pending),
        Symbol(pending),
        [
          Symbol(pending),
          Symbol(pending),
        ],
        [
          Symbol(pending),
          [
            Symbol(pending),
            Symbol(pending),
          ],
          Symbol(pending),
          [
            Symbol(pending),
            Symbol(pending),
          ],
        ],
        Symbol(pending),
        Symbol(pending),
        [
          Symbol(pending),
          Symbol(pending),
        ],
        [
          Symbol(pending),
          Symbol(pending),
        ],
      ]
    `);

    delay.resolve();
    await delay.promise;
    await new Promise((resolve) => setImmediate(resolve));

    expect(result.data.value).toMatchInlineSnapshot(`
      [
        "storage-value",
        [
          "storage-value",
          "storage-value",
        ],
        [
          "storage-value",
          "storage-value",
        ],
        "api-value-Symbol(delay)",
        [
          "api-value-Symbol(delay)",
          "api-value-Symbol(delay)",
        ],
        [
          "api-value-Symbol(delay)",
          "api-value-Symbol(delay)",
        ],
        [
          [
            "contract-0x",
            {
              "directives": {
                "defer": undefined,
                "stream": undefined,
              },
              "key": Symbol(delay),
              "type": "storage",
              "path": "test_storage",
            },
          ],
          [
            [
              "contract-0x",
              {
                "directives": {
                  "defer": undefined,
                  "stream": undefined,
                },
                "key": Symbol(delay),
                "type": "storage",
                "path": "test_storage",
              },
            ],
            [
              "contract-0x",
              {
                "directives": {
                  "defer": undefined,
                  "stream": undefined,
                },
                "key": Symbol(delay),
                "type": "storage",
                "path": "test_storage",
              },
            ],
          ],
          [
            "contract-0x",
            {
              "body": Symbol(delay),
              "directives": {
                "defer": true,
              },
              "type": "message",
              "name": "test_message",
            },
          ],
          [
            [
              "contract-0x",
              {
                "body": Symbol(delay),
                "directives": {
                  "defer": true,
                },
                "type": "message",
                "name": "test_message",
              },
            ],
            [
              "contract-0x",
              {
                "body": Symbol(delay),
                "directives": {
                  "defer": true,
                },
                "type": "message",
                "name": "test_message",
              },
            ],
          ],
        ],
        [
          [
            "contract-0x",
            {
              "directives": {
                "defer": undefined,
                "stream": undefined,
              },
              "key": Symbol(delay),
              "type": "storage",
              "path": "test_storage",
            },
          ],
        ],
        [
          [
            [
              "contract-0x",
              {
                "directives": {
                  "defer": undefined,
                  "stream": undefined,
                },
                "key": Symbol(delay),
                "type": "storage",
                "path": "test_storage",
              },
            ],
          ],
          [
            [
              "contract-0x",
              {
                "directives": {
                  "defer": undefined,
                  "stream": undefined,
                },
                "key": Symbol(delay),
                "type": "storage",
                "path": "test_storage",
              },
            ],
          ],
        ],
        [
          [
            [
              "contract-0x",
              {
                "directives": {
                  "defer": undefined,
                  "stream": undefined,
                },
                "key": Symbol(delay),
                "type": "storage",
                "path": "test_storage",
              },
            ],
          ],
          [
            [
              "contract-0x",
              {
                "directives": {
                  "defer": undefined,
                  "stream": undefined,
                },
                "key": Symbol(delay),
                "type": "storage",
                "path": "test_storage",
              },
            ],
          ],
        ],
        [
          [
            [
              [
                "contract-0x",
                {
                  "directives": {
                    "defer": undefined,
                    "stream": undefined,
                  },
                  "key": Symbol(delay),
                  "type": "storage",
                  "path": "test_storage",
                },
              ],
            ],
            [
              [
                "contract-0x",
                {
                  "directives": {
                    "defer": undefined,
                    "stream": undefined,
                  },
                  "key": Symbol(delay),
                  "type": "storage",
                  "path": "test_storage",
                },
              ],
            ],
          ],
          [
            [
              [
                "contract-0x",
                {
                  "directives": {
                    "defer": undefined,
                    "stream": undefined,
                  },
                  "key": Symbol(delay),
                  "type": "storage",
                  "path": "test_storage",
                },
              ],
            ],
            [
              [
                "contract-0x",
                {
                  "directives": {
                    "defer": undefined,
                    "stream": undefined,
                  },
                  "key": Symbol(delay),
                  "type": "storage",
                  "path": "test_storage",
                },
              ],
            ],
          ],
        ],
      ]
    `);
  });
});
