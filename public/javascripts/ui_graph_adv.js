/**
 * Request data from the server, add it to the graph and set a timeout 
 * to request again
 *
 * Note: One event update all charts as all data are recevied at once from PDNS
 * 
 */

var graph_queries;
var graph_resp_answers;
var graph_answers;
var graph_tcp;
var graph_cachehitrate;

function update_graph_queries(point) {

            var series0 = graph_queries.series[0],
                shift0 = series0.data.length > 20; // shift if the series is 
                                                 // longer than 20

            var series1 = graph_queries.series[1],
                shift1 = series1.data.length > 20; // shift if the series is 
                                                 // longer than 20

            var series2 = graph_queries.series[2],
                shift2 = series2.data.length > 20; // shift if the series is 
                                                 // longer than 20

            // add the point
            graph_queries.series[0].addPoint(point, true, shift0);
            graph_queries.series[1].addPoint(point, true, shift1);
            graph_queries.series[2].addPoint(point, true, shift2);

}


function update_graph_tcp(point) {

            var series0 = graph_tcp.series[0],
                shift0 = series0.data.length > 20; // shift if the series is 
                                                 // longer than 20

            var series1 = graph_tcp.series[1],
                shift1 = series1.data.length > 20; // shift if the series is 
                                                 // longer than 20

            var series2 = graph_tcp.series[2],
                shift2 = series2.data.length > 20; // shift if the series is 
                                                 // longer than 20

            // add the point
            graph_tcp.series[0].addPoint(point, true, shift0);
            graph_tcp.series[1].addPoint(eval(point), true, shift1);
            graph_tcp.series[2].addPoint(eval(point), true, shift2);

}

function update_cachehitrate(point) {

            var series0 = graph_cachehitrate.series[0],
                shift0 = series0.data.length > 20; // shift if the series is 
                                                 // longer than 20
	console.log(point['packetcache-hit']);
            // add the point
	var x = new Date().getTime(); // current time
	var y = Math.round(Math.random() * 100);
	console.log([x, y]);
	console.log(point['packetcache-miss'][0]);
	var time = point['packetcache-miss'][0];
	var perc = Math.round(point['packetcache-miss'][1]*100/point['packetcache-hit'][1], 2);
        //var perc-cache-hit = [ time, perc ];
	console.log([ time, perc ]);
        graph_cachehitrate.series[0].addPoint([ time, perc ], true, shift0);
}

function requestData() {
    $.ajax({
        url: '/pdnsapi/statistics',
        success: function(point) {
            console.log(point);
            update_graph_queries(point);
            update_graph_tcp(point);
            update_cachehitrate(point);
            // call it again after one minute
            setTimeout(requestData, 5000); // 5sec
        },
        cache: false,
        dataType: "json"
    });
}

$(document).ready(function() {
    graph_queries = new Highcharts.Chart({
        chart: {
            renderTo: 'graph_queries',
            defaultSeriesType: 'spline',
            events: {
                load: requestData
            }
        },
        title: {
            text: 'Live Statistics'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150,
            maxZoom: 20 * 1000
        },
        yAxis: {
            minPadding: 0.2,
            maxPadding: 0.2,
            title: {
                text: 'Value',
                margin: 80
            }
        },
        tooltip: {
            valueSuffix: 'q/s'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'All outqueries/s',
            data: []
        },
	{
            name: 'Questions/s',
            data: []
        },
	{
            name: 'Servfail answers/s',
            data: []
        }]
    });        

    graph_resp_answers = new Highcharts.Chart({
        chart: {
            renderTo: 'graph_resp_answers',
            defaultSeriesType: 'spline',
        },
        title: {
            text: 'Live Statistics'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150,
            maxZoom: 20 * 1000
        },
        yAxis: {
            minPadding: 0.2,
            maxPadding: 0.2,
            title: {
                text: 'Value',
                margin: 80
            }
        },
        series: [
	{
            name: '100-1000ms answers/s',
            data: []
        },
	{
            name: '10-100ms answers/s',
            data: []
        },
	{
            name: '1-10ms answers/s',
            data: []
        },
	{
            name: '0ms answers/s',
            data: []
        },
	{
            name: '<1 ms answers/s',
            data: []
        },
	{
            name: '0ms answers/s',
            data: []
        },
	{
            name: 'Slow answers/s',
            data: []
        }]
    });        

    graph_answers = new Highcharts.Chart({
        chart: {
            renderTo: 'graph_answers',
            defaultSeriesType: 'spline',
        },
        title: {
            text: 'Live Statistics'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150,
            maxZoom: 20 * 1000
        },
        yAxis: {
            minPadding: 0.2,
            maxPadding: 0.2,
            title: {
                text: 'Value',
                margin: 80
            }
        },
        series: [{
            name: 'Normal answers/s',
            data: []
        },
	{
            name: 'NXDOMAIN answers/s',
            data: []
        },
	{
            name: 'SERVFAIL answers/s',
            data: []
        }]
    });        

    graph_tcp = new Highcharts.Chart({
        chart: {
            renderTo: 'graph_tcp',
            defaultSeriesType: 'spline',
        },
        title: {
            text: 'Live Statistics'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150,
            maxZoom: 20 * 1000
        },
        yAxis: {
            minPadding: 0.2,
            maxPadding: 0.2,
            title: {
                text: 'Value',
                margin: 80
            }
        },
        series: [{
            name: 'TCP/IP overflows/s',
            data: []
        },
	{
            name: 'TCP/IP outqueries/s',
            data: []
        },
	{
            name: 'TCP/IP questions/s',
            data: []
        }]
    });        

    graph_cachehitrate = new Highcharts.Chart({
        chart: {
            renderTo: 'graph_cachehitrate',
            defaultSeriesType: 'spline',
        },
        title: {
            text: 'Live Statistics - percentage cache hits'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150,
            maxZoom: 20 * 1000
        },
        yAxis: {
            minPadding: 0.2,
            maxPadding: 0.2,
            title: {
                text: '% percentage',
                margin: 80
            }
        },
        series: [{
            name: '% cache hitrate',
            data: []
        }]
    });        


});

