// CONSTANTS
const sourceSheetId = "1PxGMUIxJC_7gsppGRtWdtbmNzU9EyQRO6Iqlf0XGsn8";
// GET GOOGLE SHEET DATA
google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(function () {
    var query = new google.visualization.Query(
        `https://docs.google.com/spreadsheets/d/${sourceSheetId}/gviz/tq`
    );

    query.setQuery("select A,B");
    //className,points
    query.setRefreshInterval(15);
    query.send(handleQueryResponse);
});
var data;
//var oldHouses;
var lastScores = new Map();
function handleQueryResponse(re) {
    //cl("start");
    if (re.isError()) {
        console.log(
            `Error in query: ${re.getMessage()} ${re.getDetailedMessage()}`
        );
        return;
    }
    data = re.getDataTable();
    //CREATE
    var classScores = getCol(0, 1);
    //cl(classScores);
    qi("dynamic").replaceChildren();

    //var houses = new Map([
    //    ["aria", 0],
    //    ["batsir", 0],
    //    ["gadid", 0]
    //]);
    //let oldScore;
    //for (const clas of classScores) {
    //    switch (true) {
    //        case (clas.key.includes("ארייה")):
    //            oldScore = houses.get('aria');
    //            houses.set('aria', oldScore += clas.val);
    //            break;
    //        case (clas.key.includes("בציר")):
    //            oldScore = houses.get('batsir');
    //            houses.set('batsir', oldScore += clas.val);
    //            break;
    //        case (clas.key.includes("גדיד")):
    //            oldScore = houses.get('gadid');
    //            houses.set('gadid', oldScore += clas.val);
    //            break;
    //        default: cl("found nothing");
    //    }
    //}
    //cl(houses);
    //houses = new Map([...houses.entries()].sort(function (a, b) {
    //    return b[1] - a[1];
    //}));
    //cl(houses);
    let firstRun = !lastScores.size;
    for (const classScore of classScores) {
        let node = createHtml(
            `<div id="${classScore.key}" class="scoreRow${!firstRun && lastScores.get(classScore.key) != classScore.val ? ' bgTrans' : ''}${winners.has(classScore.key) ? ' bgWin' : ''}">
                <span class="">${classScore.key}</span>
                <span class="textShadow">${classScore.val}</span>
            </div>`
        );
        qi("dynamic").append(node);
        lastScores.set(classScore.key, classScore.val);
    }
    addEventListeners();
    //for (const [name, score] of houses) {
    //    let node = createHtml(
    //        `<div class="scoreRow${oldHouses && oldHouses.get(name) != score ? ' bgTrans' : ''}">
    //        <span>${name}</span>
    //        <span>${score}</span></div>`
    //    );
    //<img width="100" src="../img/${name}.png" alt="${name}"/>
    //qi("dynamic").append(node);
    //}
    //oldHouses = houses;
    //cl("done");
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

// EVENTS
var winners = new Map();
function addEventListeners() {
    qsa("#dynamic .scoreRow").forEach(function (e) {
        e.addEventListener("click", (e) => {
            let key = e.target.id ? e.target.id : e.target.parentNode.id;
            if (winners.has(key)) {
                winners.delete(key);
                qs("#" + key).classList.remove("bgWin");
            }
            else {
                winners.set(key);
                qs("#" + key).classList.add("bgWin");
            }
            cl(key)
            cl(winners.has(key));
        });
    });
    //qs("#send").addEventListener("click", send);
    // qsa("[list]").forEach((e) => {
    //      e.addEventListener("change", isFromList);
    // });
    //qsa("#payCalc .notEmpty input").forEach((e) => {
    //     e.addEventListener("change", isTextNotEmpty);
    //});
}


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