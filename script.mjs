import { fetchUsers } from "./index.mjs";

const form = document.querySelector("form");
const inputArea = document.getElementById("usernames_list");
const selectorLanguages = document.getElementById("select_language");
const bodyTable = document.getElementById("leaderboardBody");

inputArea.addEventListener("input", () => {
  inputArea.setCustomValidity("");
});

let allUsers = [];

form.addEventListener("submit", async function fetchData(e) {
  e.preventDefault();

  let userInput = inputArea.value.trim();
  if (!userInput) {
    inputArea.setCustomValidity("Please type at least one username");
    return;
  }
  const usernames = userInput.split(",").map((name) => name.trim());
  const result = await fetchUsers(usernames);
  allUsers = result.allUsers;
  const invalidUsers = result.invalidUsers;
  const networkFailed = result.networkFailed;

  if (networkFailed) alert("Network or fetch error");
  if (invalidUsers.length && !networkFailed)
    alert(`These users were not found: ${invalidUsers.join(", ")}`);

  populateDropDownLanguage(allUsers);
  renderTable("overall");

  inputArea.value = "";
});

function populateDropDownLanguage(usersData) {
  selectorLanguages.innerHTML = "";

  const languages = new Set(["overall"]);

  usersData.forEach((user) => {
    Object.keys(user.ranks.languages).forEach((lang) => languages.add(lang));
  });

  languages.forEach((lang) => {
    const optionLanguage = document.createElement("option");
    optionLanguage.value = lang;
    optionLanguage.textContent = lang === "overall" ? "Overall Ranking" : lang;
    selectorLanguages.appendChild(optionLanguage);
  });
}

function renderTable(selectedLanguage) {
  bodyTable.innerHTML = "";

  const rows = [];
  allUsers.forEach((user) => {
    let score;
    let clan = user.clan || "";

    if (selectedLanguage === "overall") {
      score = user.ranks.overall.score;
    } else if (user.ranks.languages[selectedLanguage]) {
      score = user.ranks.languages[selectedLanguage].score;
    } else {
      return;
    }

    rows.push({ username: user.username, clan, score });
  });

  rows.sort((a, b) => b.score - a.score);

  rows.forEach((r, index) => {
    const row = document.createElement("tr");
    if (index === 0) {
      row.style.backgroundColor = "lightgreen";
      row.style.fontWeight = "bold";
    }

    const thCell = document.createElement("th");
    thCell.scope = "row";
    thCell.textContent = r.username;
    row.appendChild(thCell);

    const tdCell1 = document.createElement("td");
    tdCell1.textContent = r.clan || "No clan";
    row.appendChild(tdCell1);

    const tdCell2 = document.createElement("td");
    tdCell2.textContent = r.score;
    row.appendChild(tdCell2);

    bodyTable.appendChild(row);
  });
}

selectorLanguages.addEventListener("change", () =>
  renderTable(selectorLanguages.value)
);
