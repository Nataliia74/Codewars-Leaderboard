import test from "node:test";
import assert from "node:assert";
import nock from "nock";
import { fetchUsers } from "./index.mjs";

test("mocks a fetch function", async () => {
  const scope = nock("http://www.codewars.com")
    .get("/api/v1/users/nonexistent")
    .reply(404);

  const { allUsers, invalidUsers, networkFailed } = await fetchUsers([
    "nonexistent",
  ]);

  assert.strictEqual(allUsers.length, 0);
  assert.strictEqual(invalidUsers[0], "nonexistent");
  assert.strictEqual(invalidUsers.length, 1);
  assert.strictEqual(networkFailed, false);

  //
  // const response = await makeFetchRequest();
  // const parsedResponse = await response.json();
  // assert(parsedResponse.user === "someone");

  // Ensure that a fetch request has been replaced by the nock library. This
  // helps ensure that you're not making real fetch requests that don't match
  // the nock configuration.
  assert(scope.isDone() === true, "No matching fetch request has been made");
});
