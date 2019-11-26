/* eslint-disable no-unused-expressions */
import { fixture, assert } from "@open-wc/testing";

import "../toto-component.js";

describe("Suite cases", () => {
  it("Case default", async () => {
    const _element = await fixture("<toto-component></toto-component>");
    assert.strictEqual(_element.hello, 'Hello World!');
  });
});
