# Belly Button Challenge - Data Visualization with D3.js and Plotly

This repository contains a JavaScript script for visualizing data from the Belly Button Challenge using D3.js and Plotly. It fetches JSON data from a specified URL and generates interactive charts based on the received data.

## Prerequisites

To run the script, you need to have the following installed:

- [D3.js](https://d3js.org/)
- [Plotly.js](https://plotly.com/javascript/)

## Getting Started

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/yourusername/belly-button-challenge.git
   ```

2. Open the `index.html` file in your web browser.

3. The script will fetch data from a specified URL and initialize charts based on the received data.

## Usage

The main script is `app.js`, which contains the following functions:

- `updateCharts(sample, demographicInfo)`: Updates the charts based on the selected sample and demographic information.
- `metaData(demographicInfo)`: Updates the metadata section with demographic information.
- `hbarChart(sample)`: Generates a horizontal bar chart showing the top 10 bacteria cultures found.
- `bubbleChart(sample)`: Generates a bubble chart showing bacterial cultures per sample.

## Dependencies

- [D3.js](https://d3js.org/) - A JavaScript library for manipulating documents based on data.
- [Plotly.js](https://plotly.com/javascript/) - An open-source JavaScript graphing library that produces interactive, publication-quality graphs online.
