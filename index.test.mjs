import test from "node:test";
import assert from "node:assert";
import nock from "nock";
import { fetchUsers } from "./index.mjs";

test("mocks a fetch function", async () => {
  const scope = nock("https://www.codewars.com")
    .get("/api/v1/users/nonexistent")
    .reply(404);

  const { allUsers, invalidUsers, networkFailed } = await fetchUsers([
    "nonexistent",
  ]);

  assert.strictEqual(allUsers.length, 0);
  assert.strictEqual(invalidUsers[0], "nonexistent");
  assert.strictEqual(invalidUsers.length, 1);
  assert.strictEqual(networkFailed, false);

  assert(scope.isDone() === true, "No matching fetch request has been made");
});
