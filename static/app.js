function init(){
    var selector = document.getElementById("selDataset");
    var url = "/names";
    var option;
    Plotly.d3.json(url, function(error, response){
        if (error) return console.warn(error);
        for (var i = 0; i < response.length; i++){
            option = document.createElement('option');
            option.text = response[i];
            option.value = response[i];
            selector.appendChild(option);
        };
    });
    createMetaData('BB_940');
    createGauge('BB_940');
    createCharts('BB_940');
};

function optionChanged(sample){
//    updateCharts(sample);
    createMetaData(sample);
    createGauge(sample);
};


function createCharts(sample){
    var otuIds = [];
    var sampleValues = [];
    var hoverTexts = [];
    var url_sample = `/samples/${sample}`;
    var url_otu = '/otu';

    Plotly.d3.json(url_sample, function(error, response_sample){
        if (error) return console.warn(error);
        var otuId = response_sample.map(row => row.otu_ids);
        otuIds.push(otuId);    
        var sampleValue = response_sample.map(row => row.sample_values);
        sampleValues.push(sampleValue);
        
        // Plotly.d3.json(url_otu, function(error, response_otu){
        //     if (error) return console.warn(error);
        // hoverText.push(response_otu.map(row => row.otu_desc);
        //     for (var i = 0; i < otuIds.length; i++){
        //         hovertext = response_otu[otuIds[i]-1];
        //         hoverTexts.push(hoverText);
        //     };    
        // });   
       var PIE = document.getElementById("pie");
            var trace = {
            values: sampleValues.slice(0,10),
            labels: otuIds.slice(0,10),
            type: 'pie'
            };
            var data = [trace];
            var layout = {title: 'Pie Chart'};                            
            Plotly.newPlot(PIE, data, layout);
        });

        var BUBBLE = document.getElementById('bubble');
            var trace = {
            x: otuIds,
            y: +sampleValues,
            mode: 'markers',
            type: 'scatter', 
            marker:{
                size: sampleValues, 
                color: otuIds,
                colorscale:'rainbow'      
                }
            };
            var data = [trace];
            var layout = {xaxis: {title:'otu_ids'}, yaxis:{title:'Sample Values'}};
            Plotly.newPlot(BUBBLE, data, layout); 
   };
       
   
function updateCharts(sample){
    var PIE = document.getElementById("pie");
    var BUBBLE = document.getElementById('bubble');
    Plotly.restyle('pie', 'labels', [otuIds]);
    Plotly.restyle('pie', 'values', [sampleValues]);
    Plotly.restyle('bubble', 'x', [otuIds]);
    Plotly.restyle('bubble', 'y', [sampleValues]);
    Plotly.restyle('bubble', 'size', [sampleValues]);
    Plotly.restyle('bubble', 'color', [otuIds]);
};

function createGauge(sample){
    Plotly.d3.json(`/wfreq/${sample}`, function(error, response_wfreq) {
        if (error) return console.warn(error);
        var level = response_wfreq*20;
        // Trig to calc meter point
        var degrees = 180 - level,
        radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);
        // Path: may have to change to create a better triangle
        var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);
        var data = [{ type: 'scatter',
                    x: [0], y:[0],
                    marker: {size: 28, color:'850000'},
                    showlegend: false,
                    name: 'speed',
                    text: level,
                    hoverinfo: 'text+name'},
                    { values: [50/6, 50/6, 50/6, 50/6, 50/6, 50/6, 50],
                    rotation: 90,
                    text: ['TOO FAST!', 'Pretty Fast', 'Fast', 'Average',
                    'Slow', 'Super Slow', ''],
                    textinfo: 'text',
                    textposition:'inside',
                    marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                            'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                             'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                             'rgba(255, 255, 255, 0)']},
                    labels: ['151-180', '121-150', '91-120', '61-90', '31-60', '0-30', ''],
                     hoverinfo: 'label',
                    hole: .5,
                    type: 'pie',
                    showlegend: false
        }];
        var layout = {
                    shapes:[{
                    type: 'path',
                    path: path,
                    fillcolor: '850000',
                    line: {color: '850000'}
                    }],
                    title: '<b>Belly Button Washing Frequency</b> <br>Scrubs per Week',
                    Speed: '0-100',
                    height: 500,
                    width: 500,
                    xaxis: {zeroline:false, showticklabels:false,
                             showgrid: false, range: [-1, 1]},
                    yaxis: {zeroline:false, showticklabels:false,
                            showgrid: false, range: [-1, 1]}
                    };
        var GAUGE = document.getElementById('gauge');
        Plotly.newPlot(GAUGE, data, layout);
    });
};

function createMetaData(sample){
    var url = `/metadata/${sample}`;
    Plotly.d3.json(url, function(error, response){
        if (error) return console.warn(error);
        var metaData = document.getElementById("sampleMetaData");
        metaData.innerHTML = "";
        metaData.innerHTML = `AGE: ${response.AGE}`;
        metaData.innerHTML += `</br>BBTYPE: ${response.BBTYPE}`;
        metaData.innerHTML += `</br>ETHNICITY: ${response.ETHNICITY}`;
        metaData.innerHTML += `</br>GENDER: ${response.GENDER}`;
        metaData.innerHTML += `</br>LOCATION: ${response.LOCATION}`;
        metaData.innerHTML += `</br>SAMPLEID: ${response.SAMPLEID}`;
    });    
};

init();