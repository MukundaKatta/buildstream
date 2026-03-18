import { describe, it, expect } from "vitest";
import { Buildstream } from "../src/core.js";
describe("Buildstream", () => {
  it("init", () => { expect(new Buildstream().getStats().ops).toBe(0); });
  it("op", async () => { const c = new Buildstream(); await c.generate(); expect(c.getStats().ops).toBe(1); });
  it("reset", async () => { const c = new Buildstream(); await c.generate(); c.reset(); expect(c.getStats().ops).toBe(0); });
});
