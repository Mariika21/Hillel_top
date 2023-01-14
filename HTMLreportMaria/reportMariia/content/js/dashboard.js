/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 86.66666666666667, "KoPercent": 13.333333333333334};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8666666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "#1-0"], "isController": false}, {"data": [1.0, 500, 1500, "#1-1"], "isController": false}, {"data": [1.0, 500, 1500, "#2-0"], "isController": false}, {"data": [1.0, 500, 1500, "#2-1"], "isController": false}, {"data": [1.0, 500, 1500, "#3-0"], "isController": false}, {"data": [1.0, 500, 1500, "#3-1"], "isController": false}, {"data": [1.0, 500, 1500, "#4-0"], "isController": false}, {"data": [1.0, 500, 1500, "#4-1"], "isController": false}, {"data": [1.0, 500, 1500, "#5-0"], "isController": false}, {"data": [1.0, 500, 1500, "#5-1"], "isController": false}, {"data": [1.0, 500, 1500, "#1"], "isController": false}, {"data": [1.0, 500, 1500, "#2"], "isController": false}, {"data": [1.0, 500, 1500, "#3"], "isController": false}, {"data": [0.0, 500, 1500, "#4"], "isController": false}, {"data": [0.0, 500, 1500, "#5"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 150, 20, 13.333333333333334, 37.993333333333304, 14, 384, 24.0, 70.9, 101.89999999999998, 343.2000000000007, 16.36304134395113, 9.749645467437547, 3.16181684302389], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["#1-0", 10, 0, 0.0, 38.599999999999994, 31, 77, 34.5, 73.20000000000002, 77.0, 77.0, 1.1161960040183054, 0.42293364214756113, 0.16459530918629312], "isController": false}, {"data": ["#1-1", 10, 0, 0.0, 91.7, 60, 304, 68.5, 281.4000000000001, 304.0, 304.0, 1.1186933661483387, 0.5538843131222732, 0.1649635725472648], "isController": false}, {"data": ["#2-0", 10, 0, 0.0, 17.6, 14, 21, 17.0, 21.0, 21.0, 21.0, 1.1563367252543941, 0.4234631562210916, 0.1558344414893617], "isController": false}, {"data": ["#2-1", 10, 0, 0.0, 22.0, 19, 37, 20.0, 35.50000000000001, 37.0, 37.0, 1.156470452179947, 0.6516439950271771, 0.15585246328206315], "isController": false}, {"data": ["#3-0", 10, 0, 0.0, 17.1, 16, 20, 16.5, 19.9, 20.0, 20.0, 1.156470452179947, 0.43819388227130796, 0.17053421706950386], "isController": false}, {"data": ["#3-1", 10, 0, 0.0, 21.6, 19, 28, 20.5, 27.8, 28.0, 28.0, 1.1560693641618498, 0.5712608381502889, 0.17047507225433525], "isController": false}, {"data": ["#4-0", 10, 0, 0.0, 17.700000000000003, 15, 19, 18.0, 19.0, 19.0, 19.0, 1.1562030292519365, 0.43809255405249165, 0.17049478263383053], "isController": false}, {"data": ["#4-1", 10, 0, 0.0, 21.3, 18, 25, 21.0, 24.9, 25.0, 25.0, 1.1556685542586387, 0.5992773460071651, 0.17041596845024845], "isController": false}, {"data": ["#5-0", 10, 0, 0.0, 16.2, 15, 18, 16.0, 17.9, 18.0, 18.0, 1.1559357299734134, 0.4379912726852387, 0.1704553664316264], "isController": false}, {"data": ["#5-1", 10, 0, 0.0, 20.400000000000002, 18, 24, 20.5, 23.8, 24.0, 24.0, 1.1555350127108852, 0.5958227409290502, 0.17039627628842155], "isController": false}, {"data": ["#1", 10, 0, 0.0, 131.0, 94, 384, 103.0, 356.9000000000001, 384.0, 384.0, 1.108770373655616, 0.9690912933806408, 0.3270006375429648], "isController": false}, {"data": ["#2", 10, 0, 0.0, 39.8, 35, 58, 38.0, 56.2, 58.0, 58.0, 1.1536686663590217, 1.072551338255653, 0.3109497577295801], "isController": false}, {"data": ["#3", 10, 0, 0.0, 39.0, 35, 48, 38.5, 47.5, 48.0, 48.0, 1.1539349180706207, 1.0074392741749365, 0.34032064966535885], "isController": false}, {"data": ["#4", 10, 10, 100.0, 39.2, 34, 44, 39.0, 43.8, 44.0, 44.0, 1.1536686663590217, 1.0353725628749424, 0.34024212621135214], "isController": false}, {"data": ["#5", 10, 10, 100.0, 36.699999999999996, 33, 41, 36.5, 40.8, 41.0, 41.0, 1.1534025374855825, 1.0317546136101499, 0.3401636389850058], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 33 milliseconds, but should not have lasted longer than 10 milliseconds.", 1, 5.0, 0.6666666666666666], "isController": false}, {"data": ["The operation lasted too long: It took 39 milliseconds, but should not have lasted longer than 10 milliseconds.", 1, 5.0, 0.6666666666666666], "isController": false}, {"data": ["The operation lasted too long: It took 37 milliseconds, but should not have lasted longer than 10 milliseconds.", 1, 5.0, 0.6666666666666666], "isController": false}, {"data": ["The operation lasted too long: It took 36 milliseconds, but should not have lasted longer than 10 milliseconds.", 1, 5.0, 0.6666666666666666], "isController": false}, {"data": ["Test failed: text expected to contain /404/", 10, 50.0, 6.666666666666667], "isController": false}, {"data": ["The operation lasted too long: It took 41 milliseconds, but should not have lasted longer than 10 milliseconds.", 1, 5.0, 0.6666666666666666], "isController": false}, {"data": ["The operation lasted too long: It took 35 milliseconds, but should not have lasted longer than 10 milliseconds.", 3, 15.0, 2.0], "isController": false}, {"data": ["The operation lasted too long: It took 38 milliseconds, but should not have lasted longer than 10 milliseconds.", 2, 10.0, 1.3333333333333333], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 150, 20, "Test failed: text expected to contain /404/", 10, "The operation lasted too long: It took 35 milliseconds, but should not have lasted longer than 10 milliseconds.", 3, "The operation lasted too long: It took 38 milliseconds, but should not have lasted longer than 10 milliseconds.", 2, "The operation lasted too long: It took 33 milliseconds, but should not have lasted longer than 10 milliseconds.", 1, "The operation lasted too long: It took 39 milliseconds, but should not have lasted longer than 10 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["#4", 10, 10, "Test failed: text expected to contain /404/", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["#5", 10, 10, "The operation lasted too long: It took 35 milliseconds, but should not have lasted longer than 10 milliseconds.", 3, "The operation lasted too long: It took 38 milliseconds, but should not have lasted longer than 10 milliseconds.", 2, "The operation lasted too long: It took 33 milliseconds, but should not have lasted longer than 10 milliseconds.", 1, "The operation lasted too long: It took 39 milliseconds, but should not have lasted longer than 10 milliseconds.", 1, "The operation lasted too long: It took 37 milliseconds, but should not have lasted longer than 10 milliseconds.", 1], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
