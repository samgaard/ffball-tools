function cleanValue(value) {
    var result;

    // remove any html
    result = value.replace(/(<([^>]+)>)/ig, "");
    // remove some other uneeded strings
    result = value.replace('No new player Notes', "");

    return result || value;
}

// transactions scraper
var table = document.querySelectorAll('#transactions .Table');
var results = [];
for (var i = 0, row; row = table[0].rows[i]; i++) {
    results[i] = [];
    for (var j = 1, col; col = row.cells[j]; j++) {
        // get the value of the table cell
        let value = col.innerHTML;

        // special handing
        if (j === 1) {
            var playerName = col.querySelectorAll('.Pbot-xs a');
            if (playerName[0]) {
                value = playerName[0].innerText;
                value = cleanValue(value)
                results[i].push(value)
                var price = col.querySelectorAll('h6.F-shade.Fz-xxs');
                if (price[0]) {
                    value = price[0].innerText;
                }
            }
        } else {
            var teamName = col.querySelectorAll('.Tst-team-name');
            if (teamName[0]) {
                value = teamName[0].innerText;
            }
        }

        value = cleanValue(value)
        // add to results
        results[i].push(value);
    }
}

// helper function to create and export a csv
function exportToCsv(rows) {
    var processRow = function(row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            }
            
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + '\n';
    };

    var csvFile = '';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }
    console.log(csvFile)
}

exportToCsv(results);