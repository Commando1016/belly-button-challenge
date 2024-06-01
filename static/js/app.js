const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

let samples = [];
let metadata = [];

// Fetch the JSON data and initialize charts
d3.json(url).then((data) => {
    console.log("Data:", data);

    const selector = d3.select("#selDataset");
    ({ metadata, samples, names } = data);

    names.forEach((id) => {
        selector.append("option").text(id).property("value", id);
    });

    updateCharts(samples[0], metadata[0]);

    selector.on("change", function () {
        const selectedId = this.value;
        const selectedSample = samples.find(sample => sample.id === selectedId);
        const selectedMeta = metadata.find(meta => meta.id == selectedId);

        updateCharts(selectedSample, selectedMeta);
    });
});

function updateCharts(sample, demographicInfo) {
    metaData(demographicInfo);
    hbarChart(sample);
    bubbleChart(sample);
}

function getPlotlyLayout(titleText, xaxisTitle, heightPercent, widthPercent) {
    // Calculate dimensions as a percentage of the window size
    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;

    // Define your percentage values for margins
    const marginPercent = {
        l: 5,  // 5% of screen width
        r: 0,  // 0% of screen width
        t: 5,  // 5% of screen height
        b: 5, // 10% of screen height
    };

    // Convert percentages to actual pixel values
    const layout = {
        margin: {
            l: (marginPercent.l / 100) * screenWidth,
            r: (marginPercent.r / 100) * screenWidth,
            t: (marginPercent.t / 100) * screenHeight,
            b: (marginPercent.b / 100) * screenHeight,
        },
        height: (heightPercent / 100) * screenHeight,
        width: (widthPercent / 100) * screenWidth,
        title: {
            text: titleText,
            font: {
                size: 24
            }
        },
        xaxis: {
            title: {
                text: xaxisTitle,
                font: {
                    size: 18
                }
            }
        }
    };

    return layout;
}

function metaData(demographicInfo) {
    const demoSelect = d3.select("#sample-metadata");
    demoSelect.html(`
        id: ${demographicInfo.id} <br> 
        ethnicity: ${demographicInfo.ethnicity} <br>
        gender: ${demographicInfo.gender} <br>
        age: ${demographicInfo.age} <br>
        location: ${demographicInfo.location} <br>
        bbtype: ${demographicInfo.bbtype} <br>
        wfreq: ${demographicInfo.wfreq}
    `);
}

function hbarChart(sample) {
    const x_axis = sample.sample_values.slice(0, 10).reverse();
    const y_axis = sample.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
    const text = sample.otu_labels.slice(0, 10).reverse();

    const barChart = {
        x: x_axis,
        y: y_axis,
        text: text,
        type: "bar",
        orientation: "h",
    };

    const layout = getPlotlyLayout("Top 10 Bacteria Cultures Found", "Number of Bacteria", 50, 70);

    Plotly.newPlot("bar", [barChart], layout);
}
function bubbleChart(sample) {
    const bubble = {
        x: sample.otu_ids,
        y: sample.sample_values,
        text: sample.otu_labels,
        mode: "markers",
        marker: {
            color: sample.otu_ids,
            colorscale: [
                [0, 'rgb(0, 0, 128)'],            // Dark Blue
                [1 / 4, 'rgb(64, 224, 208)'],        // Turquoise
                [1 / 3, 'rgb(57, 255, 20)'],         // Neon Green
                [2 / 3, 'rgb(101, 67, 33)'],         // Dark Brown
                [1, 'rgb(255, 237, 160)']          // Light Brown
            ],
            size: sample.sample_values,
        },
        type: "scatter",
    };
    console.log(sample.otu_ids);
    const layout = getPlotlyLayout("Bacterial Cultures per Sample", "OTU ID", 50, 80);

    Plotly.newPlot("bubble", [bubble], layout);
}

// Define the optionChanged function to be used in the HTML onchange attribute
function optionChanged(value) {
    const selectedSample = samples.find(sample => sample.id === value);
    const selectedMeta = metadata.find(meta => meta.id == value);
    updateCharts(selectedSample, selectedMeta);
}
