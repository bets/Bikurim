// CONSTANTS
const sourceSheetId = "14pu483lxT0EgADHWcWW_zoEzhObH7vUiIB8hKfWJMVM";
// GET GOOGLE SHEET DATA
google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(function () {
    var query = new google.visualization.Query(
        `https://docs.google.com/spreadsheets/d/${sourceSheetId}/gviz/tq`
    );

    query.setQuery("select A,B");
    //className,points
    query.setRefreshInterval(20);
    query.send(handleQueryResponse);
});
var data;
var oldHouses;
function handleQueryResponse(re) {
    if (re.isError()) {
        console.log(
            `Error in query: ${re.getMessage()} ${re.getDetailedMessage()}`
        );
        return;
    }
    data = re.getDataTable();
    //CREATE
    var classScores = getCol(0, 1);
    qi("dynamic").replaceChildren();

    var houses = new Map([
        ["aria", 0],
        ["batsir", 0],
        ["gadid", 0]
    ]);
    let oldScore;
    for (const clas of classScores) {
        switch (true) {
            case (clas.key.includes("ארייה")):
                oldScore = houses.get('aria');
                houses.set('aria', oldScore += clas.val);
                break;
            case (clas.key.includes("בציר")):
                oldScore = houses.get('batsir');
                houses.set('batsir', oldScore += clas.val);
                break;
            case (clas.key.includes("גדיד")):
                oldScore = houses.get('gadid');
                houses.set('gadid', oldScore += clas.val);
                break;
            default: cl("found nothing");
        }
    }
    //cl(houses);
    houses = new Map([...houses.entries()].sort(function (a, b) {
        return b[1] - a[1];
    }));
    //cl(houses);

    for (const [name, score] of houses) {
        let node = createHtml(
            `<div class="scoreRow${oldHouses && oldHouses.get(name) != score ?' bgTrans':''}"><img width="100" src="../img/${name}.png"/><span>${score}</span></div>`//<label>${item.key}</label>
        );
        qi("dynamic").append(node);
    }
    oldHouses = houses;
}

// HANDEL DATA FROM SHEETS

//Get a column or 2 from sheet db
//return as array of {lable,val}
//If only 1 column so val will be index number
function getCol(col, valCol) {
    var rows = [];
    var key;
    for (let i = 0; i < data.getNumberOfRows(); i++) {
        key = getValue(i, col);
        let cell = isNaN(key) ? key?.trim() : key.toString();
        if (cell.length == 0) break;
        rows.push({
            key: key,
            val: valCol ? getValue(i, valCol) : i + 1
        });
    }
    return rows;
}

//get value from sheet db (starts at 0)
function getValue(row, col) {
    // if (row + 2 == data.getNumberOfRows()) return "";
    // return data.getValue(row + 2, col) ?? "";
    return data.getValue(row, col);
}

//Get the data-val from the option of the chosen key
// function getValFromList(rowNum, tdClass) {
//      let key = qs(`[data-rownum='${rowNum}'] .${tdClass} input`).value;
//      let option = Array.from(qsa(`#${tdClass}List option`)).find(
//           (x) => x.innerText == key
//      );
//      return option ? option.dataset.val : null;
// }

// CREATE ELEMENTS

function createHtml(str) {
    return document.createRange().createContextualFragment(str);
}
// function getNextLetter(char) {
//      return String.fromCharCode(char.charCodeAt(char.length - 1) + 1); //go to next letter
// }
//
// function makeTextInput(item) {
//      let node = createHtml(
//           `<p><label>${item.key}</label><br/><input type="text"></p>`
//      );
//      qi("dynamic").append(node);
// }
// var letter = "a";
// function makeRadioInput(item) {
//      let node = document.createElement("p");
//      let radioTitle = createHtml(`<label>${item.key}</label>`);
//      node.append(radioTitle);
//      let rndName = `${letter}-opt`;
//      for (const [i, val] of item.val.entries()) {
//           let option = createHtml(
//                `<div class="radioOption"><input type="radio" id="${rndName}-${i}" name="${rndName}" value="${val}" ${
//                     i == 0 ? 'checked=""' : ""
//                }>
//   <label for="${rndName}-${i}">${val}</label></div>`
//           );
//           node.append(option);
//      }
//      qi("dynamic").append(node);
//      letter = getNextLetter(letter);
// }
// function makeTemplatedSelect(dataCol, target, label) {
//      let node = createHtml(`<div id="${target}"><label>${label}</label></div>`);
//      qi("dynamic").append(node);
//      makeSelect(getCol(dataCol), target);
// }
// //Create a list of options to populate an input
// function makeSelect(options, target, isId) {
//      let input = document.createElement("input");
//      input.type = "search";
//      input.setAttribute("placeholder", "נא לבחור"); // ▼
//      input.setAttribute("list", target + "List");
//      var datalist = document.createElement("datalist");
//      datalist.id = target + "List";
//      for (let i in options) {
//           var option = document.createElement("option");
//           option.textContent = options[i].key ?? options[i];
//           // option.value = options[i].val ?? options[i];
//           // option.value = options[i].key ?? options[i];
//           option.setAttribute("data-val", options[i].val ?? options[i]);
//           datalist.appendChild(option);
//      }
//      qs("#" + target).appendChild(input);
//      qi("lists").appendChild(datalist);
// }

function saveToStorage() {
    localStorage.setItem("name", qs("#name input").value);
}
function restoreFromStorage() {
    let saved = localStorage.getItem("name");
    if (saved == null) return;
    qs("#name input").value = saved;
}

// CALCULATIONS

// function getListInputDataVal(selector) {
//      let inputElement = qs(selector);
//      let option = Array.from(inputElement.list.querySelectorAll("option")).find(
//           (x) => x.innerText == inputElement.value
//      );
//      if (option == null) return null;
//      return option.dataset.val;
// }
// EVENTS
// function addEventListeners() {
//      qsa("#name input").forEach(function (e) {
//           e.addEventListener("change", () => setTimeout(saveToStorage, 1000));
//      });
//      qs("#send").addEventListener("click", send);
//      // qsa("[list]").forEach((e) => {
//      //      e.addEventListener("change", isFromList);
//      // });
//      qsa("#payCalc .notEmpty input").forEach((e) => {
//           e.addEventListener("change", isTextNotEmpty);
//      });
// }
//   VALIDATIONS
// function isFromList(e) {
//      isFromListCheck(e.target);
// }
//returns false if invalid
// function isFromListCheck(el) {
//      if (!el.list) return true;
//      let option = Array.from(el.list.querySelectorAll("option")).find(
//           (x) => x.innerText == el.value
//      );
//      if (option != null) el.classList.remove("invalidList");
//      else el.classList.add("invalidList");
//      showErrorMsg();
//      return !el.classList.contains("invalidList");
// }
// function isListNotEmpty() {
//      qsa("[list]").forEach((el) => {
//           if (el.value && isFromListCheck(el)) {
//                el.classList.remove("invalidList");
//           } else {
//                el.classList.add("invalidList");
//           }
//      });
// }

// function isPatternMatch() {
//      qsa("#payCalc [pattern]").forEach((el) => {
//           if (el.checkValidity()) {
//                el.classList.remove("invalidPattern");
//           } else {
//                el.classList.add("invalidPattern");
//           }
//      });
//      showErrorMsg();
// }
// function isTextNotEmpty(event) {
//      let els = event ? [event.target] : qsa(".notEmpty input");
//      els.forEach((el) => {
//           if (el.value) {
//                el.classList.remove("invalidEmpty");
//           } else {
//                el.classList.add("invalidEmpty");
//           }
//      });
//      showErrorMsg();
// }
// function validateFailed() {
//      isListNotEmpty();
//      isTextNotEmpty();

//      return showErrorMsg();
// }
// function showErrorMsg() {
//      let errors = ["invalidList", "invalidEmpty"];
//      let hasError = false;
//      errors.forEach((s) => {
//           if (qsa(`.${s}`).length > 0) {
//                qs(`#${s}`).style.display = "list-item";
//                hasError = true;
//           } else qs(`#${s}`).style.display = "none";
//      });
//      return hasError;
// }

// // SUBMIT DATA
// function send() {
//      cl("send");
//      if (qi("send").innerText == "בשליחה") return;
//      // if (validateFailed()) return;
//      qi("send").innerText = "בשליחה";
//      qi("loading").classList.remove("hide");
//      let timestamp = new Date().toLocaleString("he-IL");
//      let rowAr = [];
//      rowAr.push(timestamp);
//      rowAr = Array.from(qsa("input")).reduce((ar, el) => {
//           if (
//                (el.type != "radio" || el.checked) &&
//                el.getAttribute("list") != "classNameList"
//           ) {
//                ar.push(el.value);
//           }
//           return ar;
//      }, rowAr);
//      let appendAr = [];
//      appendAr.push(rowAr);
//      cl(appendAr);
//      /////
//      let targetSheetURL = getValue(1, 2);
//      const regex = /d\/(.+)\//g;
//      let match = regex.exec(targetSheetURL);
//      let targetSheetID = match[1];
//      let webhook = getValue(0, 2);
//      /////
//      let today = new Date();
//      let sheetName = qs("#className input").value;
//      let targetSheetRange = `'${sheetName}'!A1:J1000`;
//      cl(targetSheetRange);
//      var formData = new FormData();
//      formData.append("sheetId", targetSheetID);
//      formData.append("sheetName", sheetName);
//      formData.append("range", targetSheetRange);
//      formData.append("values", JSON.stringify(appendAr));
//      postData(formData, webhook);
//      // postData(formData, "https://webhook.site/85fc9a60-2a96-4d34-80e2-1da2add13bdb");
// }

// async function postData(formData, webhook) {
//      const response = await fetch(webhook, {
//           method: "POST",
//           cache: "no-store",
//           body: formData
//      });
//      qi("loading").classList.add("hide");
//      if (response.ok) {
//           qi("send").innerText = "נשלח";
//           let text = await response.text(); //.json()
//           console.log(text);
//           alert("נשלח בהצלחה!");
//      } else {
//           qi("send").innerText = "שליחה";
//           let json = await response.json();
//           console.log(json);
//           alert("לא הצלחנו לשלוח - נא לנסות שוב.\nשגיאה:\n" + json.message);
//      }
// }

// SELECTORS
function qs(s) {
    return document.querySelector(s);
}
function qsa(s) {
    return document.querySelectorAll(s);
}
function qi(s) {
    return document.getElementById(s);
}
function qc(s) {
    return document.getElementsByClassName(s)[0];
}
function qca(s) {
    return document.getElementsByClassName(s);
}
function qp(p, n) {
    return document.querySelector(`[${p}="${n}"]`);
}
function cl(txt) {
    console.log(txt);
}