const form = document.querySelector("form");
const inputArea = document.getElementById("usernames_list");
// const errorMessage = document.getElementById("error");
const selectorLanguages = document.getElementById("select_language");
// const fetchButton = document.getElementById("getDataButton");
const tableLeaders = document.getElementById("leaderboardTable");
const bodyTable = document.getElementById("leaderboardBody");

inputArea.addEventListener("input", () => {
  inputArea.setCustomValidity("");
});

form.addEventListener("submit", async function fetchData(e) {
  e.preventDefault();
  let userInput = inputArea.value.trim();

  if (!userInput) {
    inputArea.setCustomValidity("Please type at least one username!");
    // inputArea.reportValidity();
    return;
  } else {
    inputArea.setCustomValidity("");
  }
  let usernames = userInput.split(",").map((name) => name.trim());
  try {
    // bodyTable.innerHTML = "";
    for (let username of usernames) {
      const response = await fetch(
        `https://www.codewars.com/api/v1/users/${username}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      renderTable(data);
    }
    inputArea.value = "";
  } catch (error) {
    // errorMessage.textContent = error.message;
    alert(error.message);
    inputArea.value = "";
  }
});

function renderTable(data) {
  const row = document.createElement("tr");

  const thRow = document.createElement("th");
  thRow.scope = "row";
  thRow.textContent = data.username;
  row.appendChild(thRow);

  const tdRow1 = document.createElement("td");
  tdRow1.textContent = data.clan || "No clan";
  row.appendChild(tdRow1);

  const tdRow2 = document.createElement("td");
  tdRow2.textContent = data.honor;
  row.appendChild(tdRow2);

  bodyTable.appendChild(row);
}
