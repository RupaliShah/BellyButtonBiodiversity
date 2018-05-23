function getSampleNames(){
    var selector = Document.getElementById("#selDataset");
    var url = "/names";
    Plotly.d3.json(url, function(error, response){
        if (error) return console.warn(error);
        for (var i = 0; i<response.lenth; i++){
            var option = document.createElement('option')
            option.text = response[i];
            option.value = response[i];
            selector.appendChild(option)
        };
    });
};

function optionChanged(){
    getData(sample);
    UpdateMetaData(sample);
}

function getData(sample){

    var url_sample = `/samples/${sample}`;
    Plotly.d3.json(url, function(error, response_sample){
        if (error) return console.warn(error);
        var otuIds = response_sample.map(row => row.otu_ids);
        var sampleValues = response_sample.map(row => row.sample_values);
    });

    var url_otu = `/otu/${sample}`;
    Plotly.d3.json(url, function(error, response_otu){
        if (error) return console.warn(error);
        var hovertext = response_otu.map(row => row.otu_desc);
    });

    updatePie(otuIds,sample_values, hovertext);
    updateBubble(otuIds,sample_values, hovertext);
}


function UpdatePie(otuIds,sample_values,hovertext){       
    
    otuIds = otuIds.slice(0,10);
    sampleValues = sampleValues.slice(0,10);
    hovertext = hovettext.slice(0,10);

    var PIE = document.getElementById('#pie');
    if (PIE.innerHTML == " ") {
        var trace = {
        labels: otuIds,
        values: sampleValues,
        hovertext: hovertext,
        type: "pie" 
        };
        var data = [trace];
        var layout = {margin:{l:10, r:10, t:10, b:10}};
        Plotly.newPlot(PIE, data, layout);
    }
    else{
        Plotly.restyle(PIE, labels, [otuIds])
        Plotly.restyle(PIE, values, [sampleValues])
        Plotly.restyle(PIE, hovertext, [hovertext])
    };
};


function UpdateBubble(sampleotuIds, sampleValues, hovertext){

    var BUBBLE = document.getElementById('#bubble');
    if (BUBBLE.innerHTML == " ") {
        var trace = {
            x: otuIDs,
            y: sampleValues,
            mode: "markers",
            type = "scatter", 
            marker:{
                size: sampleValues, 
                color: otuIDS,
                colorscale:"rainbow", 
                opacity: .8
                }
                //   hoverinfo:
        };
        var data = [trace];
        var layout = {xaxis: {title:'otu_ids'}, yaxis:{title:'Sample Values'}};
        Plotly.newPlot(BUBBLE, data, layout);    
    }
    else {
        Plotly.restyle(BUBBLE, 'x', [OtuIDS]);
        Plotly.restyle(BUBBLE, 'y', [SampleValues]);
    }; 
};

function UpdateMetaData(sample){
    var url = `/metadata/${sample}`;
    Plotly.d3.json(url, function(error, response){
        if (error) return console.warn(error);
        var metaData = document.getElementById("#sampleMetaData");
        metaData.innerHTML = `AGE: ${response.AGE}`;
        metaData.innerHTML = `<br>BBTYPE: ${response.BBTYPE}`;
        metaData.innerHTML = `<br>ETHNICITY: ${response.ETHNICITY}`;
        metaData.innerHTML = `<br>GENDER: ${response.GENDER}`;
        metaData.innerHTML = `<br>LOCATION: ${response.LOCATION}`;
        metaData.innerHTML = `<br>SAMPLEID: ${response.SAMPLEID}`;
    });
};

getSampleNames();

