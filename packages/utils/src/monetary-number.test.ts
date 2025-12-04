import { MonetaryNumber } from "./monetary-number.js";
import { describe, expect, it, test } from "vitest";

describe("fromPlanck", () => {
  it("leads to correct atomics value", () => {
    expect(new MonetaryNumber("1", 0).minorUnits).toEqual(1n);
    expect(new MonetaryNumber("1", 1).minorUnits).toEqual(1n);
    expect(new MonetaryNumber("1", 2).minorUnits).toEqual(1n);

    expect(new MonetaryNumber("1", 5).minorUnits).toEqual(1n);
    expect(new MonetaryNumber("2", 5).minorUnits).toEqual(2n);
    expect(new MonetaryNumber("3", 5).minorUnits).toEqual(3n);
    expect(new MonetaryNumber("10", 5).minorUnits).toEqual(10n);
    expect(new MonetaryNumber("20", 5).minorUnits).toEqual(20n);
    expect(new MonetaryNumber("30", 5).minorUnits).toEqual(30n);
    expect(
      new MonetaryNumber("100000000000000000000000", 5).minorUnits,
    ).toEqual(100000000000000000000000n);
    expect(
      new MonetaryNumber("200000000000000000000000", 5).minorUnits,
    ).toEqual(200000000000000000000000n);
    expect(
      new MonetaryNumber("300000000000000000000000", 5).minorUnits,
    ).toEqual(300000000000000000000000n);

    expect(new MonetaryNumber("44", 5).minorUnits).toEqual(44n);
    expect(new MonetaryNumber("044", 5).minorUnits).toEqual(44n);
    expect(new MonetaryNumber("0044", 5).minorUnits).toEqual(44n);
    expect(new MonetaryNumber("00044", 5).minorUnits).toEqual(44n);
  });

  it("reads MonetaryNumbers correctly", () => {
    expect(new MonetaryNumber("44", 0).toString()).toEqual("44");
    expect(new MonetaryNumber("44", 1).toString()).toEqual("4.4");
    expect(new MonetaryNumber("44", 2).toString()).toEqual("0.44");
    expect(new MonetaryNumber("44", 3).toString()).toEqual("0.044");
    expect(new MonetaryNumber("44", 4).toString()).toEqual("0.0044");
  });

  it("reads negative integer correctly", () => {
    expect(new MonetaryNumber("-44", 0).toString()).toEqual("-44");
    expect(new MonetaryNumber("-44", 1).toString()).toEqual("-4.4");
  });
});

describe("fromMajorUnits", () => {
  it("throws helpful error message for invalid characters", () => {
    expect(() => MonetaryNumber.fromMajorUnits(" 13", 5)).toThrow(
      /invalid character at position 1/i,
    );
    expect(() => MonetaryNumber.fromMajorUnits("1,3", 5)).toThrow(
      /invalid character at position 2/i,
    );
    expect(() => MonetaryNumber.fromMajorUnits("13-", 5)).toThrow(
      /invalid character at position 3/i,
    );
    expect(() => MonetaryNumber.fromMajorUnits("13/", 5)).toThrow(
      /invalid character at position 3/i,
    );
    expect(() => MonetaryNumber.fromMajorUnits("13\\", 5)).toThrow(
      /invalid character at position 3/i,
    );
  });

  it("throws for more than one separator", () => {
    expect(() => MonetaryNumber.fromMajorUnits("1.3.5", 5)).toThrow(
      /more than one separator found/i,
    );
    expect(() => MonetaryNumber.fromMajorUnits("1..3", 5)).toThrow(
      /more than one separator found/i,
    );
    expect(() => MonetaryNumber.fromMajorUnits("..", 5)).toThrow(
      /more than one separator found/i,
    );
  });

  it("throws for separator only", () => {
    expect(() => MonetaryNumber.fromMajorUnits(".", 5)).toThrow(
      /fractional part missing/i,
    );
  });

  it.skip("throws for more decimals than supported", () => {
    expect(() => MonetaryNumber.fromMajorUnits("44.123456", 5)).toThrow(
      /got more MonetaryNumbers than supported/i,
    );
    expect(() => MonetaryNumber.fromMajorUnits("44.1", 0)).toThrow(
      /got more MonetaryNumbers than supported/i,
    );
  });

  it("throws for decimals that are not non-negative integers", () => {
    // no integer
    expect(() => MonetaryNumber.fromMajorUnits("1", Number.NaN)).toThrow(
      /Decimals is not an integer/i,
    );
    expect(() =>
      MonetaryNumber.fromMajorUnits("1", Number.POSITIVE_INFINITY),
    ).toThrow(/Decimals is not an integer/i);
    expect(() =>
      MonetaryNumber.fromMajorUnits("1", Number.NEGATIVE_INFINITY),
    ).toThrow(/Decimals is not an integer/i);
    expect(() => MonetaryNumber.fromMajorUnits("1", 1.78945544484)).toThrow(
      /Decimals is not an integer/i,
    );

    // negative
    expect(() => MonetaryNumber.fromMajorUnits("1", -1)).toThrow(
      /Decimals must not be negative/i,
    );
    expect(() =>
      MonetaryNumber.fromMajorUnits("1", Number.MIN_SAFE_INTEGER),
    ).toThrow(/Decimals must not be negative/i);

    // exceeds supported range
    expect(() => MonetaryNumber.fromMajorUnits("1", 101)).toThrow(
      /Decimals must not exceed 100/i,
    );
  });

  it("returns correct value", () => {
    expect(MonetaryNumber.fromMajorUnits("44", 0).minorUnits).toEqual(44n);
    expect(MonetaryNumber.fromMajorUnits("44", 1).minorUnits).toEqual(440n);
    expect(MonetaryNumber.fromMajorUnits("44", 2).minorUnits).toEqual(4400n);
    expect(MonetaryNumber.fromMajorUnits("44", 3).minorUnits).toEqual(44000n);

    expect(MonetaryNumber.fromMajorUnits("44.2", 1).minorUnits).toEqual(442n);
    expect(MonetaryNumber.fromMajorUnits("44.2", 2).minorUnits).toEqual(4420n);
    expect(MonetaryNumber.fromMajorUnits("44.2", 3).minorUnits).toEqual(44200n);

    expect(MonetaryNumber.fromMajorUnits("44.1", 6).minorUnits).toEqual(
      44100000n,
    );
    expect(MonetaryNumber.fromMajorUnits("44.12", 6).minorUnits).toEqual(
      44120000n,
    );
    expect(MonetaryNumber.fromMajorUnits("44.123", 6).minorUnits).toEqual(
      44123000n,
    );
    expect(MonetaryNumber.fromMajorUnits("44.1234", 6).minorUnits).toEqual(
      44123400n,
    );
    expect(MonetaryNumber.fromMajorUnits("44.12345", 6).minorUnits).toEqual(
      44123450n,
    );
    expect(MonetaryNumber.fromMajorUnits("44.123456", 6).minorUnits).toEqual(
      44123456n,
    );
  });

  it("cuts leading zeros", () => {
    expect(MonetaryNumber.fromMajorUnits("4", 2).minorUnits).toEqual(400n);
    expect(MonetaryNumber.fromMajorUnits("04", 2).minorUnits).toEqual(400n);
    expect(MonetaryNumber.fromMajorUnits("004", 2).minorUnits).toEqual(400n);
  });

  it("cuts tailing zeros", () => {
    expect(MonetaryNumber.fromMajorUnits("4.12", 5).minorUnits).toEqual(
      412000n,
    );
    expect(MonetaryNumber.fromMajorUnits("4.120", 5).minorUnits).toEqual(
      412000n,
    );
    expect(MonetaryNumber.fromMajorUnits("4.1200", 5).minorUnits).toEqual(
      412000n,
    );
    expect(MonetaryNumber.fromMajorUnits("4.12000", 5).minorUnits).toEqual(
      412000n,
    );
    expect(MonetaryNumber.fromMajorUnits("4.120000", 5).minorUnits).toEqual(
      412000n,
    );
    expect(MonetaryNumber.fromMajorUnits("4.1200000", 5).minorUnits).toEqual(
      412000n,
    );
  });

  it("interprets the empty string as zero", () => {
    expect(MonetaryNumber.fromMajorUnits("", 0).minorUnits).toEqual(0n);
    expect(MonetaryNumber.fromMajorUnits("", 1).minorUnits).toEqual(0n);
    expect(MonetaryNumber.fromMajorUnits("", 2).minorUnits).toEqual(0n);
    expect(MonetaryNumber.fromMajorUnits("", 3).minorUnits).toEqual(0n);
  });

  it("accepts american notation with skipped leading zero", () => {
    expect(MonetaryNumber.fromMajorUnits(".1", 3).minorUnits).toEqual(100n);
    expect(MonetaryNumber.fromMajorUnits(".12", 3).minorUnits).toEqual(120n);
    expect(MonetaryNumber.fromMajorUnits(".123", 3).minorUnits).toEqual(123n);
  });
});

describe("toString", () => {
  it("displays no decimals point for full numbers", () => {
    expect(MonetaryNumber.fromMajorUnits("44", 0).toString()).toEqual("44");
    expect(MonetaryNumber.fromMajorUnits("44", 1).toString()).toEqual("44");
    expect(MonetaryNumber.fromMajorUnits("44", 2).toString()).toEqual("44");

    expect(MonetaryNumber.fromMajorUnits("44", 2).toString()).toEqual("44");
    expect(MonetaryNumber.fromMajorUnits("44.0", 2).toString()).toEqual("44");
    expect(MonetaryNumber.fromMajorUnits("44.00", 2).toString()).toEqual("44");
    expect(MonetaryNumber.fromMajorUnits("44.000", 2).toString()).toEqual("44");
  });

  it("only shows significant digits", () => {
    expect(MonetaryNumber.fromMajorUnits("44.1", 2).toString()).toEqual("44.1");
    expect(MonetaryNumber.fromMajorUnits("44.10", 2).toString()).toEqual(
      "44.1",
    );
    expect(MonetaryNumber.fromMajorUnits("44.100", 2).toString()).toEqual(
      "44.1",
    );
  });

  it("fills up leading zeros", () => {
    expect(new MonetaryNumber("3", 0).toString()).toEqual("3");
    expect(new MonetaryNumber("3", 1).toString()).toEqual("0.3");
    expect(new MonetaryNumber("3", 2).toString()).toEqual("0.03");
    expect(new MonetaryNumber("3", 3).toString()).toEqual("0.003");
  });

  it("handles zero value", () => {
    expect(new MonetaryNumber(0, 18).toString()).toEqual("0");
  });
});

describe("toNumber", () => {
  it("works", () => {
    expect(MonetaryNumber.fromMajorUnits("0", 5).valueOf()).toEqual(0);
    expect(MonetaryNumber.fromMajorUnits("1", 5).valueOf()).toEqual(1);
    expect(MonetaryNumber.fromMajorUnits("1.5", 5).valueOf()).toEqual(1.5);
    expect(MonetaryNumber.fromMajorUnits("0.1", 5).valueOf()).toEqual(0.1);

    expect(
      MonetaryNumber.fromMajorUnits("1234500000000000", 5).valueOf(),
    ).toEqual(1.2345e15);
    expect(
      MonetaryNumber.fromMajorUnits("1234500000000000.002", 5).valueOf(),
    ).toEqual(1.2345e15);
  });
});

describe("toLocaleString", () => {
  it("acts like normal number when denominator is omitted", () => {
    const string = new MonetaryNumber(30, 0).toLocaleString("en-NZ");

    expect(string).toBe((30).toLocaleString("en-NZ"));
  });

  it("add currency to the string value", () => {
    const string = new MonetaryNumber(30, 0, "DOT").toLocaleString("en-NZ");

    expect(string).toContain("DOT");
    expect(string).toContain("30.00");
  });

  it("keep compact notation", () => {
    const string = new MonetaryNumber(30000, 0, "DOT").toLocaleString("en-NZ", {
      notation: "compact",
    });

    expect(string).toContain("DOT");
    expect(string).toContain("30K");
  });
});

test("mapMinorUnits", () => {
  const number = new MonetaryNumber(30, 0, "DOT").mapMinorUnits(
    (planck) => planck * 2n,
  );

  expect(number.toString()).toEqual("60");
});

test("mapMajorUnits", () => {
  const number = new MonetaryNumber(30, 0, "DOT").mapMajorUnits(
    (number) => number * 2,
  );

  expect(number.toString()).toEqual("60");
});
