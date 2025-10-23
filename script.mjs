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

let allUsers = [];

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

  allUsers = [];
  bodyTable.innerHTML = "";
  const invalidUsers = [];

  for (let username of usernames) {
    try {
      const response = await fetch(
        `https://www.codewars.com/api/v1/users/${username}`
      );
      if (!response.ok) {
        invalidUsers.push(username);
        // throw new Error(`HTTP error! status: ${response.status}`);
        continue;
      }

      const data = await response.json();
      allUsers.push(data);
    } catch {
      invalidUsers.push(username);
    }
  }

  if (invalidUsers.length) {
    alert(`These users were not found: ${invalidUsers.join(", ")}`);
  }

  populateDropDownLanguage(allUsers);
  renderTable("overall");

  inputArea.value = "";
  // } catch (error) {
  //   // errorMessage.textContent = error.message;
  //   alert(error.message);
  //   inputArea.value = "";
  // }
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
    if (index === 0) row.style.backgroundColor = "gold";

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
