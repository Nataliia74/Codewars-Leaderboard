export async function fetchUsers(usernames) {
  const allUsers = [];
  const invalidUsers = [];
  let networkFailed = false;

  for (let username of usernames) {
    try {
      const response = await fetch(
        `https://www.codewars.com/api/v1/users/${username}`
      );
      if (!response.ok) {
        invalidUsers.push(username);
        continue;
      }
      const data = await response.json();
      allUsers.push(data);
    } catch {
      networkFailed = true;
      invalidUsers.push(username);
    }
  }
  return { allUsers, invalidUsers, networkFailed };
}
