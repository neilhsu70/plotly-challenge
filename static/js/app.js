var idList = [] 

var file = "samples.json";
var data = []

var infoPanel = d3.select(".panel-body")
infoPanel.append("ol").classed("panel-list", true)
var panelList = d3.select(".panel-list")


function load(){
    var dropSelect = d3.select("#selDataset")
        
    d3.json(file).then((incoming)=> {
                    
        incoming.names.forEach(function (id){ 
            dropSelect
            .append("option")
            .text(id)
        });
    });
};

load()

function optionChanged(value){
    console.log(value)
    buildplot(value);
};


function buildplot(id){ 

    d3.json(file).then((incoming)=> {

        var filteredId = incoming.samples.filter(d => d.id === id);
        var idNum = filteredId[0].id;
        var values = filteredId[0].sample_values;
        var otuIds = filteredId[0].otu_ids;
        var otuLabels = filteredId[0].otu_labels;
        var values10 = filteredId[0].sample_values.slice(0, 10);
        var otuIds10 = filteredId[0].otu_ids.slice(0, 10).toString();
        var otuLabels10 = filteredId[0].otu_labels.slice(0, 10);
        console.log(otuIds);
        var filteredMeta = incoming.metadata.filter(d => d.id === +id);
        var freq = incoming.metadata.filter(d => d.id === +id).map(d => d.wfreq);
        console.log(`meta wash: ${freq}`)
      
        panelList.selectAll('li').remove("html");
        
        Object.entries(filteredMeta[0]).forEach( function(key, value){
            console.log(key, value);
            d3.select(".panel-list").append("li").text(key[0].toUpperCase() + ": " + key[1])
        });

        var data1 = [{
            x: values10,
            y: otuIds10,
            text: otuLabels10,
            type: "bar",
            orientation: "h",
            marker: {
                color: "purple"
            }
        }];
         
        var data2 = [{
            x: otuIds,
            y: values,
            mode: "markers",
            marker: {
                size: values,
                color: otuIds
            },
            text: otuLabels
        }];

        var bonus = [{
                domain: {x: [0, 1], y: [0, 1] },
                value: parseFloat(freq),
                title: {text: `<b>Weekly Washing Frequency</b><br>Scrubs per Week`},
                type: "indicator",
                mode: "gauge",
                gauge: {
                    axis: {range: [null, 9] },
                    steps: [
                        {range: [0, 1], color: "purple" },
                        {range: [1, 2], color: "royalblue" },
                        {range: [2, 3], color: "lightblue" },
                        {range: [3, 4], color: "green" },
                        {range: [4, 5], color: "yellow" },
                        {range: [5, 6], color: "orange" },
                        {range: [6, 7], color: "red" },
                        {range: [7, 8], color: "magenta" },
                        {range: [8, 9], color: "darkred" }
                    ],
                    threshold: {
                        line: {color: "black", width: 5 },
                        thickness: 1,
                        value: 9
                      }
                }
            }];
        
        var layout1 = {
            title: `<b>Top 10 OTU for Subject ID: ${idNum}</b>`, 
            xaxis: {title: "Sample Values"}, 
            yaxis: {title: "OTU ids",
                    tickmode: "linear",
                    ticktext: [otuIds],
                    autorange: "reversed",
                    tickvtextsrc: otuIds},
            margin: {
                l: 75,
                r: 75,
                t: 75,
                b: 30
            }
        };

        var layout2 = {
            xaxis: { title: `<b>OTU ID ${idNum}</b>` },
            height: 600,
            width: 1000
        };

        
        var degrees = (20 * freq), radius = .15;
        var radians = degrees * Math.PI / 180;
        var x = radius - (radius * Math.cos(radians)) +.1;
        var y = radius * Math.sin(radians) +.3;
        if (degrees >= 90){
            x = x + .5;
        };
 
        var bonusLayout = {
            shapes:[{
                type: 'line',
                x0: .5,
                y0: .1,
                x1: x,
                y1: y,
                line: {
                  color: 'black',
                  width: 5
                }
              }],
            width: 600,
            height: 400,
            xaxis: {visible: false, range: [-1, 1]},
            yaxis: {visible: false, range: [-1, 1]}
        };
        
    Plotly.newPlot("bubble", data2, layout2);
    Plotly.newPlot("bar", data1, layout1);
    Plotly.newPlot("gauge", bonus, bonusLayout, {staticPlot: true});
    });
};

buildplot('940');