import { Await } from "./await.js";
import { render } from "@testing-library/react";
import { act, Suspense } from "react";
import { expect, test } from "vitest";

test("Await component", async () => {
  const { promise, resolve } = Promise.withResolvers<string>();

  const result = await act(() =>
    render(
      <Suspense fallback={<div data-testid="fallback">Loading...</div>}>
        <Await promise={promise}>
          {(result) => <div data-testid="target">{result}</div>}
        </Await>
      </Suspense>,
    ),
  );

  expect(result.getByTestId("fallback").textContent).toBe("Loading...");

  await act(async () => {
    resolve("Hello, World!");
    await promise;
  });

  expect(result.getByTestId("target").textContent).toBe("Hello, World!");
});
