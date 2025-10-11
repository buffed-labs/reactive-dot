import type { Finality } from "../../types.js";
import { InkQuery } from "./query-builder.js";
import { describe, expect, it } from "vitest";

describe("initialization", () => {
  it("should initialize with empty instructions", () => {
    const query = new InkQuery();
    expect(query.instructions).toEqual([]);
  });

  it("should freeze instructions array", () => {
    const query = new InkQuery();
    expect(Object.isFrozen(query.instructions)).toBe(true);
  });
});

describe("rootStorage", () => {
  it("should add root storage read instruction without options", () => {
    const query = new InkQuery().rootStorage();
    expect(query.instructions).toMatchInlineSnapshot(`
      [
        {
          "at": undefined,
          "directives": {
            "defer": undefined,
          },
          "key": undefined,
          "method": "storage",
          "path": "",
        },
      ]
    `);
  });

  it("should add root storage read instruction with finality", () => {
    const query = new InkQuery().rootStorage({ at: "finalized" as Finality });
    expect(query.instructions).toMatchInlineSnapshot(`
      [
        {
          "at": "finalized",
          "directives": {
            "defer": undefined,
          },
          "key": undefined,
          "method": "storage",
          "path": "",
        },
      ]
    `);
  });
});

describe("storage", () => {
  it("should add storage read instruction without key", () => {
    const query = new InkQuery().storage("test-path", undefined);
    expect(query.instructions).toMatchInlineSnapshot(`
      [
        {
          "at": undefined,
          "directives": {
            "defer": undefined,
          },
          "key": undefined,
          "method": "storage",
          "path": "test-path",
        },
      ]
    `);
  });

  it("should add storage read instruction with key", () => {
    const query = new InkQuery().storage("test-path", "key-value");
    expect(query.instructions).toMatchInlineSnapshot(`
      [
        {
          "at": undefined,
          "directives": {
            "defer": undefined,
          },
          "key": "key-value",
          "method": "storage",
          "path": "test-path",
        },
      ]
    `);
  });

  it("should add storage read instruction with key and options", () => {
    const query = new InkQuery().storage("test-path", "key-value", {
      at: "finalized" as Finality,
    });
    expect(query.instructions).toMatchInlineSnapshot(`
      [
        {
          "at": "finalized",
          "directives": {
            "defer": undefined,
          },
          "key": "key-value",
          "method": "storage",
          "path": "test-path",
        },
      ]
    `);
  });
});

describe("storages", () => {
  it("should add multi storage read instruction without options", () => {
    const query = new InkQuery().storages("test-path", ["key1", "key2"]);
    expect(query.instructions).toMatchInlineSnapshot(`
      [
        {
          "at": undefined,
          "directives": {
            "defer": undefined,
            "stream": undefined,
          },
          "keys": [
            "key1",
            "key2",
          ],
          "method": "storage",
          "multi": true,
          "path": "test-path",
        },
      ]
    `);
  });

  it("should add multi storage read instruction with options", () => {
    const query = new InkQuery().storages("test-path", ["key1", "key2"], {
      at: "finalized" as Finality,
    });
    expect(query.instructions).toMatchInlineSnapshot(`
      [
        {
          "at": "finalized",
          "directives": {
            "defer": undefined,
            "stream": undefined,
          },
          "keys": [
            "key1",
            "key2",
          ],
          "method": "storage",
          "multi": true,
          "path": "test-path",
        },
      ]
    `);
  });
});

describe("message", () => {
  it("should add message send instruction without body", () => {
    const query = new InkQuery().message("test-message");
    expect(query.instructions).toMatchInlineSnapshot(`
      [
        {
          "at": undefined,
          "body": undefined,
          "directives": {
            "defer": undefined,
          },
          "method": "message",
          "name": "test-message",
          "origin": undefined,
        },
      ]
    `);
  });

  it("should add message send instruction with body", () => {
    const query = new InkQuery().message("test-message", { foo: "bar" });
    expect(query.instructions).toMatchInlineSnapshot(`
      [
        {
          "at": undefined,
          "body": {
            "foo": "bar",
          },
          "directives": {
            "defer": undefined,
          },
          "method": "message",
          "name": "test-message",
          "origin": undefined,
        },
      ]
    `);
  });

  it("should add message send instruction with body and options", () => {
    const query = new InkQuery().message(
      "test-message",
      { foo: "bar" },
      { at: "finalized" as Finality },
    );
    expect(query.instructions).toMatchInlineSnapshot(`
      [
        {
          "at": "finalized",
          "body": {
            "foo": "bar",
          },
          "directives": {
            "defer": undefined,
          },
          "method": "message",
          "name": "test-message",
          "origin": undefined,
        },
      ]
    `);
  });
});

describe("messages", () => {
  it("should add multi message send instruction without options", () => {
    const query = new InkQuery().messages("test-message", [
      { foo: "bar1" },
      { foo: "bar2" },
    ]);
    expect(query.instructions).toMatchInlineSnapshot(`
      [
        {
          "at": undefined,
          "bodies": [
            {
              "foo": "bar1",
            },
            {
              "foo": "bar2",
            },
          ],
          "directives": {
            "defer": undefined,
            "stream": undefined,
          },
          "method": "message",
          "multi": true,
          "name": "test-message",
          "origin": undefined,
        },
      ]
    `);
  });

  it("should add multi message send instruction with options", () => {
    const query = new InkQuery().messages(
      "test-message",
      [{ foo: "bar1" }, { foo: "bar2" }],
      { at: "finalized" as Finality },
    );
    expect(query.instructions).toMatchInlineSnapshot(`
      [
        {
          "at": "finalized",
          "bodies": [
            {
              "foo": "bar1",
            },
            {
              "foo": "bar2",
            },
          ],
          "directives": {
            "defer": undefined,
            "stream": undefined,
          },
          "method": "message",
          "multi": true,
          "name": "test-message",
          "origin": undefined,
        },
      ]
    `);
  });
});

describe("chaining", () => {
  it("should support chaining multiple operations", () => {
    const query = new InkQuery()
      .storage("path1", "key1")
      .message("msg1", { data: "value" })
      .storages("path2", ["key2", "key3"])
      .messages("msg2", [{ item: 1 }, { item: 2 }])
      .rootStorage({ at: "finalized" as Finality });

    expect(query.instructions).toHaveLength(5);
    expect(query.instructions[0]).toMatchInlineSnapshot(`
      {
        "at": undefined,
        "directives": {
          "defer": undefined,
        },
        "key": "key1",
        "method": "storage",
        "path": "path1",
      }
    `);
    expect(query.instructions[4]).toMatchInlineSnapshot(`
      {
        "at": "finalized",
        "directives": {
          "defer": undefined,
        },
        "key": undefined,
        "method": "storage",
        "path": "",
      }
    `);
  });

  it("should create a new instance for each chain call", () => {
    const query1 = new InkQuery();
    const query2 = query1.storage("path", "key");
    const query3 = query2.message("msg");

    expect(query1).not.toBe(query2);
    expect(query2).not.toBe(query3);
    expect(query1.instructions).toHaveLength(0);
    expect(query2.instructions).toHaveLength(1);
    expect(query3.instructions).toHaveLength(2);
  });
});
