import { describe, it, expect } from "vitest";
import { cn, generateId, formatDuration, formatCurrency, getBlockTypeColor } from "@/lib/utils";

describe("cn", () => {
  it("merges class names correctly", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("resolves tailwind conflicts", () => {
    expect(cn("px-4", "px-2")).toBe("px-2");
  });
});

describe("generateId", () => {
  it("returns a string", () => {
    expect(typeof generateId()).toBe("string");
  });

  it("returns non-empty strings", () => {
    expect(generateId().length).toBeGreaterThan(0);
  });
});

describe("formatDuration", () => {
  it("formats milliseconds", () => {
    expect(formatDuration(500)).toBe("500ms");
  });

  it("formats seconds", () => {
    expect(formatDuration(2500)).toBe("2.5s");
  });

  it("formats minutes and seconds", () => {
    expect(formatDuration(125000)).toBe("2m 5s");
  });
});

describe("formatCurrency", () => {
  it("formats cents to dollars", () => {
    expect(formatCurrency(100)).toBe("$1.0000");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.0000");
  });
});

describe("getBlockTypeColor", () => {
  it("returns blue for research", () => {
    expect(getBlockTypeColor("research")).toBe("#3b82f6");
  });

  it("returns purple for writer", () => {
    expect(getBlockTypeColor("writer")).toBe("#8b5cf6");
  });

  it("returns amber for analyst", () => {
    expect(getBlockTypeColor("analyst")).toBe("#f59e0b");
  });

  it("returns green for coder", () => {
    expect(getBlockTypeColor("coder")).toBe("#10b981");
  });

  it("returns gray for unknown types", () => {
    expect(getBlockTypeColor("unknown")).toBe("#6b7280");
  });
});
