// Define the URL for fetching JSON data
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Initialize arrays for storing samples and metadata
let samples = [];
let metadata = [];

// Fetch the JSON data and initialize charts
d3.json(url).then((data) => {
    console.log("Data:", data);

    // Select the dropdown menu
    const selector = d3.select("#selDataset");

    // Destructure the data object to extract metadata, samples, and names
    ({ metadata, samples, names } = data);

    // Populate the dropdown menu with sample names
    names.forEach((id) => {
        selector.append("option").text(id).property("value", id);
    });

    // Update charts with the first sample and metadata
    updateCharts(samples[0], metadata[0]);

    // Listen for changes in the dropdown menu
    selector.on("change", function () {
        // Get the selected sample ID
        const selectedId = this.value;
        // Find the selected sample and metadata
        const selectedSample = samples.find(sample => sample.id === selectedId);
        const selectedMeta = metadata.find(meta => meta.id == selectedId);

        // Update charts with the selected sample and metadata
        updateCharts(selectedSample, selectedMeta);
    });
});

// Function to update charts with sample data and metadata
function updateCharts(sample, demographicInfo) {
    metaData(demographicInfo);
    hbarChart(sample);
    bubbleChart(sample);
}

// Function to generate Plotly layout
function getPlotlyLayout(titleText, xaxisTitle, heightPercent, widthPercent) {
    // Calculate dimensions as a percentage of the window size
    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;

    // Define percentage values for margins
    const marginPercent = {
        l: 5,  // 5% of screen width
        r: 0,  // 0% of screen width
        t: 5,  // 5% of screen height
        b: 5,  // 10% of screen height
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

// Function to display metadata
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

// Function to generate horizontal bar chart
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

// Function to generate bubble chart
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

    const layout = getPlotlyLayout("Bacterial Cultures per Sample", "OTU ID", 50, 80);

    Plotly.newPlot("bubble", [bubble], layout);
}

// Define the optionChanged function to be used in the HTML onchange attribute
function optionChanged(value) {
    const selectedSample = samples.find(sample => sample.id === value);
    const selectedMeta = metadata.find(meta => meta.id == value);
    updateCharts(selectedSample, selectedMeta);
}
