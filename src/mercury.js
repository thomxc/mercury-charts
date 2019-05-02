/**
 * @namespace Mercury
 */
Mercury = {};
Mercury.collection = [];

Mercury.findChartByElementId = function (id) {
    for (var key in this.collection) {
        if (this.collection[key].chart.canvas.id == id) {
            return this.collection[key];
        }
    }
};

Mercury.requestChart = function (canvasElement, canvasCollection) {
    var chart;
    jQuery.ajax({
        url: canvasElement.dataset.chartAction,
        type: "GET",
        data: {
            'params': JSON.parse(canvasElement.dataset.chartParams)
        }
    }).done(function (data) {
        chart = Mercury.createChart(canvasElement, data);
        Mercury.collection.push(chart);
    }).always(function (data) {
        Mercury.getNextChart(canvasCollection.pop(), canvasCollection);
    });
};
Mercury.refreshCollection = function () {
    // recursively fetch and build charts
    var canvasCollection = jQuery('canvas[data-chart-autoload!="false"]').toArray();
    if (canvasCollection.length > 0) {
        canvasCollection.reverse();
        var firstCanvasElement = canvasCollection.pop();
        if (firstCanvasElement.dataset.chartData == undefined) {
            Mercury.requestChart(firstCanvasElement, canvasCollection);
        } else {
            Mercury.createOfflineChart(firstCanvasElement, canvasCollection)
        }
    }
};

jQuery(document).ready(function () {
    Mercury.refreshCollection();
});

Mercury.createLineChart = function (canvasElement, data) {

    var options = JSON.parse(canvasElement.dataset.chartOptions);
    var ctx = canvasElement.getContext("2d");
    if (canvasElement.dataset.chartEvents) {
        var events = JSON.parse(canvasElement.dataset.chartEvents);
        for (var i in events) {
            options[i] = eval(events[i]);
        }
    }
    
    if (canvasElement.dataset.chartTooltip) {
        var tooltips = JSON.parse(canvasElement.dataset.chartTooltip);
        for (var i in tooltips) {
            options['tooltips']['callbacks'][i] = eval(tooltips[i]);
        }
    }
    var chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
    return chart;
};

Mercury.createBarChart = function (canvasElement, data) {
    var options = JSON.parse(canvasElement.dataset.chartOptions);

    var ctx = canvasElement.getContext("2d");
    if (canvasElement.dataset.chartEvents) {
        var events = JSON.parse(canvasElement.dataset.chartEvents);
        for (var i in events) {
            options[i] = eval(events[i]);
        }
    }
    var chart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });

    return chart;
};

Mercury.createRadarChart = function (canvasElement, data) {
    var options = JSON.parse(canvasElement.dataset.chartOptions);

    var ctx = canvasElement.getContext("2d");
    var chart = new Chart(ctx, {
        type: 'radar',
        data: data,
        options: options
    });


    return chart;
};

Mercury.createPieChart = function (canvasElement, data) {
    var options = JSON.parse(canvasElement.dataset.chartOptions);
    var ctx = canvasElement.getContext("2d");
    var chart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: options
    });


    return chart;
};

Mercury.createDoughnutChart = function (canvasElement, data) {
    var options = JSON.parse(canvasElement.dataset.chartOptions);

    var ctx = canvasElement.getContext("2d");
    var chart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });

    return chart;
};

Mercury.createPolarChart = function (canvasElement, data) {
    var options = JSON.parse(canvasElement.dataset.chartOptions);

    var ctx = canvasElement.getContext("2d");
    var chart = new Chart(ctx, {
        type: 'polarArea',
        data: data,
        options: options
    });

    return chart;
};

Mercury.createChart = function (canvasElement, data)
{
    switch (canvasElement.dataset.chartType) {
        case 'line':
            chart = Mercury.createLineChart(canvasElement, data);
            break;
        case 'bar':
            chart = Mercury.createBarChart(canvasElement, data);
            break;
        case 'radar':
            chart = Mercury.createRadarChart(canvasElement, data);
            break;
        case 'pie':
            chart = Mercury.createPieChart(canvasElement, data);
            break;
        case 'doughnut':
            chart = Mercury.createDoughnutChart(canvasElement, data);
            break;
        case 'polar':
            chart = Mercury.createPolarChart(canvasElement, data);
            break;
    }
    return chart;
};

Mercury.getNextChart = function (canvasElement, canvasCollection)
{
    if (canvasElement != undefined) {
        if (canvasElement.dataset.chartData == undefined) {
            Mercury.requestChart(canvasElement, canvasCollection);
        } else {
            Mercury.createOfflineChart(canvasElement, canvasCollection)
        }
    }
};

Mercury.createOfflineChart = function (canvasElement, canvasCollection)
{
    var data = {
        labels: JSON.parse(canvasElement.dataset.chartLabels),
        datasets: [{
            data: JSON.parse(canvasElement.dataset.chartData),
            backgroundColor: "rgba(45,109,163,1)"
        }]
    };
    var chart = Mercury.createChart(canvasElement, data);
    Mercury.collection.push(chart);
    Mercury.getNextChart(canvasCollection.pop(), canvasCollection);
};
