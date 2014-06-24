/**
 * Request data from the server, add it to the graph and set a timeout 
 * to request again
 *
 * Note: One event update all charts as all data are recevied at once from PDNS
 * 
 */

function getURLParameter(name) {
  return window.location.pathname.split('/')[2];
}

var graph_cachehitrate;

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
    var server = getURLParameter('server');
    $.ajax({
        url: '/servers/'+server+'/statistics/dump',
        success: function(point) {
            console.log(point);
            update_cachehitrate(point);
            // call it again after one minute
            setTimeout(requestData, 5000); // 5sec
        },
        cache: false,
        dataType: "json"
    });
}

$(document).ready(function() {

    graph_cachehitrate = new Highcharts.Chart({
        chart: {
            renderTo: 'graph_cachehitrate',
            defaultSeriesType: 'spline',
            events: {
                load: requestData
            }
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

