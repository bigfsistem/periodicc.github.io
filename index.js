// Global Divs
const containerDiv = document.getElementById("boxContainer");
const resultsDiv = document.getElementById("resultsDiv");

// Auth System
var onLogin = {}
var accessCodes = {
    "4322f8dd0a77782491d572f558d997def31494c43e5f41e3283a5e3b0f17c3b8": "10/03/2023 17:51",
    "3f068752c489521db6145a1bf6e2aa0adee507eb8876277cb677a29892734da7": "09/03/2023 22:00", //abJob
    "ef451ece87caa9c7317d5d8da5c1158aac0de00b77dca9a6c211debd09b51072": "09/03/2023 22:00", //abJob
    "fd9b10c88e8f9009917bcdc5644cf975cd0ccbe07826b586005475f9d592d3f9": "01/04/2033 16:37" //FXR
};
containerDiv.innerHTML = `<h1>Verificam cererea dvs...</h1><a class="loading"></a>`;

// Global Functions
function sha256(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);

    const buffer = new ArrayBuffer(data.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < data.length; i++) {
        view[i] = data[i];
    }

    return window.crypto.subtle.digest('SHA-256', buffer).then(hash => {
        const hexCodes = [];
        const view = new Uint8Array(hash);
        for (let i = 0; i < view.length; i++) {
            const value = view[i].toString(16);
            const padding = '00';
            hexCodes.push(padding.substr(0, padding.length - value.length) + value);
        }
        return hexCodes.join('');
    });
}

async function getUserIp() {
    try {
        const response = await fetch("https://api.ipify.org/?format=json");
        if (!response.ok) {
            return containerDiv.innerHTML = "<h1>Procesul de verificare nu a fost cu succes.</h1>";
        }
        const data = await response.json();

        return data.ip;
    } catch (error) {
        process.exit(1);
    }
}

function convertDate(now) {
    const date = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const hour = now.getHours();
    const minute = now.getMinutes();

    return `${date < 10 ? "0" + date : date}/${month < 10 ? "0" + month : month}/${year} ${hour}:${minute < 10 ? "0" + minute : minute}`;
} 

function compareDates(date1, date2) {
    const date1Array = date1.split(" ");
    const date2Array = date2.split(" ");
  
    const [day1, month1, year1] = date1Array[0].split("/");
    const [day2, month2, year2] = date2Array[0].split("/");
  
    const [hour1, minute1] = date1Array[1].split(":");
    const [hour2, minute2] = date2Array[1].split(":");
  
    const dateObject1 = new Date(year1, month1 - 1, day1, hour1, minute1);
    const dateObject2 = new Date(year2, month2 - 1, day2, hour2, minute2);
  
    return dateObject1 - dateObject2;
}

// Verify Procces
window.onload = async function() {
    onLogin.userIp = await getUserIp();

    sha256(onLogin.userIp).then(function(hash) {
        if (accessCodes[hash] != undefined) {
            if(compareDates(convertDate(new Date()), accessCodes[hash]) > 0 ) {
                return containerDiv.innerHTML = `<h1><span class="fas fa-ban"></span> Acces interzis #2. (<span style="-webkit-user-select: all;-ms-user-select: all; user-select:all;">${hash}</span>)</h1>`;
            }

            runSecuredCode();
        } else {
            return containerDiv.innerHTML = `<h1><span class="fas fa-ban"></span> Acces interzis. (<span style="-webkit-user-select: all;-ms-user-select: all; user-select:all;">${hash}</span>)</h1>`;
        }
    });
}


// Secured Code
function runSecuredCode() {
    containerDiv.innerHTML = "";
    resultsDiv.innerHTML = "";
    document.title = "Numere Periodice ";

    const link = document.createElement("link");
        link.rel = "icon";
        link.href = "";
        link.type = "image/x-icon";
    document.head.appendChild(link);

    const image = document.createElement("img");
        image.setAttribute("src", "");
    containerDiv.appendChild(image);

    const h1 = document.createElement("h1");
        h1.textContent = "Numere Periodice";
    containerDiv.appendChild(h1);

    const textarea = document.createElement("textarea");
        textarea.setAttribute("id", "pageCode");
        textarea.setAttribute("placeholder", "Adauga aici codul copiat ( NESINE.COM)");
    containerDiv.appendChild(textarea);

    const button = document.createElement("button");
        button.innerHTML = '<i class="fas fa-check"></i> Verifica';
    containerDiv.appendChild(button);

    const h2 = document.createElement("h2");
        h2.textContent = "Coduri Periodice";
    containerDiv.appendChild(h2);


    //Main Code
    document.querySelector("button").addEventListener("click", function() {
        resultsDiv.innerHTML = "";
        sha256(onLogin.userIp).then(function(hash) {
            if(compareDates(convertDate(new Date()), accessCodes[hash]) > 0 ) {
                return containerDiv.innerHTML = `<h1><span class="fas fa-hourglass-end"></span> Accesul dvs. a expirat. (<span style="-webkit-user-select: all;-ms-user-select: all; user-select:all;">${hash}</span>)</h1>`;
            }

            const input = document.querySelector("textarea").value;
            document.querySelector("textarea").value = "";
            
            if (input == undefined || input == "") {
                return
            }

            const contains = (table, element) => {
                for (const value of table) {
                    if (value === element) {
                        return true;
                    }
                }
                return false;
            };

            var results = {};

            const checkPeriodic = (code, odds) => {
                if (!code || code === '' || code.length !== 5 || !odds) {
                    return;
                }
                

                const numTable = [];
                for (let i = 0; i < code.length; i++) {
                    numTable[i] = code.charAt(i);
                }

                const uniqueTable = [];
                for (const char of numTable) {
                    if (!contains(uniqueTable, char)) {
                        uniqueTable.push(char);
                    }
                }
                uniqueTable.sort();

                let min = 'none';
                let max = 'none';
                for (let i = 1; i <= uniqueTable.length; i++) {
                    if (!contains(uniqueTable, String(i)) && Number(i) < Number(uniqueTable[uniqueTable.length - 1])) {
                        if ((contains(uniqueTable, String(i - 1)) && contains(uniqueTable, String(i - 2))) || (contains(uniqueTable, String(i + 1)) && contains(uniqueTable, String(i + 2)))) {
                            min = i;
                            break;
                        }
                    }
                }

                if (min === 'none') {
                    return;
                }

                if (uniqueTable[uniqueTable.length - 1] === '9') {
                    for (let i = 8; i >= 1; i--) {
                        if (!contains(uniqueTable, String(i))) {
                            if ((contains(uniqueTable, String(i - 1)) && contains(uniqueTable, String(i + 1))) || (contains(uniqueTable, String(i + 1)) && contains(uniqueTable, String(i + 2)))) {
                                max = i;
                                break;
                            }
                        }
                    }
                } else {
                    for (let i = 9; i >= 1; i--) {
                        if (!contains(uniqueTable, String(i))) {
                            if (contains(uniqueTable, String(i - 1)) && contains(uniqueTable, String(i - 2))) {
                                max = i;
                                break;
                            }
                        }
                    }
                }

                if (max === 'none' || Number(max) <= Number(min)) {
                    return;
                } else {
                    const checkedOdds = {
                        num: 0,
                        goodOdds: 0,
                    };

                    for (const odd of odds) {
                        if (String(odd).includes(min) && String(odd).includes(max)) {
                            checkedOdds.num += 1;
                            checkedOdds.goodOdds = odd;
                        }
                    }

                    if (checkedOdds.num === 1) {
                        results[code] = [];
                        results[code].push(Number(checkedOdds.goodOdds));
                    }
                }
            };

            var allCodes = {};
            var code;

            input.split('\n').forEach(function(line) {
                if (line.match(/\d{5}/)) {
                    code = line;
                    if (code.includes("NEW")) {
                        code = code.replace("NEW", "");
                    } else if (code.includes("YENİ")) {
                        code = code.replace("YENİ", "");
                    } else if (code.includes("NOU")) {
                        code = code.replace("NOU", "");
                    }
                    allCodes[code] = [];
                } else if (line.match(/\d+\.\d{2}/) && code) {
                    line.match(/\d+\.\d{2}/g).forEach(function(odd) {
                        allCodes[code].push(Number(odd));
                    });
                }
            });

            for (var code in allCodes) {
                if (allCodes.hasOwnProperty(code)) {
                    checkPeriodic(code, allCodes[code]);
                }
            }

            for (var goodCodes in results) {
                if (results.hasOwnProperty(goodCodes)) {
                    const text = document.createElement("h2");
                        text.textContent = goodCodes + ' - ' + results[goodCodes];
                    resultsDiv.appendChild(text);
                }
            }

            if(Object.keys(results).length === 0) {
                const text = document.createElement("h2");
                        text.textContent = "Nu a fost gasit niciun cod.";
                text.setAttribute("style", "-webkit-user-select: none; -ms-user-select: none; user-select: none;")
                resultsDiv.appendChild(text);
            }
        });
    });
}
