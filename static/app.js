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
    UpdatePie(sample);
    UpdateBubble(sample);
    UpdateMetaData(sample);
}

function UpdatePie(sample){
    
    var url_sample = `/samples/${sample}`;
    Plotly.d3.json(url, function(error, response_sample){
        if (error) return console.warn(error);
        response_sample = response_sample.slice(0,10)
        var labels = response_sample.map(row => row.otu_ids);
        var values = response_sample.map(row => row.sample_values);
    });

    var url_otu = `/otu/${sample}`;
    Plotly.d3.json(url, function(error, response_otu){
        if (error) return console.warn(error);
        response_otu = response_otu.slice(0,10);
        var hovertext = response_otu.map(row => row.otu_desc);
    });
        
//        var labels = []
//        var values = []
//        var hovers = []
//        for (i=0, i<response.lenth, i++){
//           var label = response[0].otu_ids[i];
//           labels.push(label);
//           var value = response[1].sample_values[i];
//           values.push(value);
//       };
        
    var PIE = document.getElementById('#pie');
    if (PIE.innerHTML == " ") {
        var trace = {
        labels: labels,
        values: values,
        hovertext: hovertext,
        type: "pie" 
        };
    
        var data = [trace];
        var layout = {margin:{l:10, r:10, t:10, b:10}};

        Plotly.newPlot(PIE, data, layout);
    }
    else{
        Plotly.restyle(PIE, labels, [labels])
        Plotly.restyle(PIE, values, [values])
        Plotly.restyle(PIE, hovertext, [hovertext])
    };
};


function UpdateBubble(sample){
    var url = `/samples/${sample}`
    Plotly.d3.json(url, function(error, response){
        if (error) return console.warn(error);
        //  var otuIDs = response[0].otu_ids[i];
         //  var sampleValues = response[1].sample_values[i];
        
        var otuIDs = response_sample.map(row => row.otu_ids);
        var sampleValues = response_sample.map(row => row.sample_values);

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
    });
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

