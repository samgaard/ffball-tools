// transactions scraper
var table = document.querySelectorAll('.data-table table');
var results = [];
for (var i = 0, row; row = table[0].rows[i]; i++) {
    results[i] = [];
    for (var j = 0, col; col = row.cells[j]; j++) {
        // get the value of the table cell
        let value = col.innerHTML;

        // special handing
        if (j === 1) {
            var playerName = col.querySelectorAll('.ysf-player-name');
            if (playerName[0]) {
                value = playerName[0].innerText;
            }
        }

        // remove any html
        value = value.replace(/(<([^>]+)>)/ig, "");
        // remove some other uneeded strings
        value = value.replace('No new player Notes', "");
        // add to results
        results[i].push(value);
    }
}

// helper function to create and export a csv
function exportToCsv(filename, rows) {
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

    var blob = new Blob([csvFile], {type: 'text/csv;charset=utf-8;'});
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) {
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

var d = new Date();
var n = d.toDateString();
var m = d.getMilliseconds();

// create a unique file name
exportToCsv(n + '-' + m + '.csv', results);