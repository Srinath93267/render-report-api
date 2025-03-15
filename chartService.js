const { ChartJSNodeCanvas } = require("chartjs-node-canvas");

// Chart size
const width = 300;
const height = 300;

const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

//#region portfolio performance chart
async function getInvestmentGrowthChart(data) {
    const configuration = {
        type: "line", // Use "line" for an area chart
        data: {
            labels: ["YTD", "1 Y", "3 Y", "5 Y", "10 Y", "SI"],
            datasets: [{
                label: "Investment Growth",
                data: [
                    data.investmentGrowthYTD,
                    data.investmentGrowth1Y,
                    data.investmentGrowth3Y,
                    data.investmentGrowth5Y,
                    data.investmentGrowth10Y,
                    data.investmentGrowthSinceInception
                ], // Growth data
                borderColor: "#008FFB", // Line color
                backgroundColor: "rgba(0,143,251,0.2)", // Area fill color with transparency
                fill: true, // Enables the area chart effect
                tension: 0.4, // Makes the line smooth (optional)
            }]
        },
        options: {
            responsive: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: ""
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Value (₹)"
                    }
                }
            }
        }
    };

    // Render chart as buffer (image)
    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

    return imageBuffer;
}

async function getAnnualizedReturnsChart(data) {
    const configuration = {
        type: "bar", // Bar chart type
        data: {
            labels: ["YTD", "1 Y", "3 Y", "5 Y", "10 Y", "SI"],
            datasets: [{
                label: "Annualized Returns",
                data: [
                    data.annualizedReturnYTD,
                    data.annualizedReturn1Y,
                    data.annualizedReturn3Y,
                    data.annualizedReturn5Y,
                    data.annualizedReturn10Y,
                    data.annualizedReturnSinceInception
                ], 
                backgroundColor: ["#008FFB"], // Bar colors
                borderColor: "#333",
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: ""
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Percentage (%)"
                    },
                    beginAtZero: true
                }
            }
        }
    };

    // Render chart as buffer (image)
    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

    return imageBuffer;
}

async function getRiskLevelChart(data) {

    const color = getRiskColor(data.riskLevel);
    const configuration = {
        type: "doughnut", // Doughnut chart mimics radial bars
        data: {
            labels: [],
            datasets: [{
                data: [30, 70], // Portfolio allocation percentages
                backgroundColor: [color, "#D3D3D3"],
                borderWidth: 0,
                cutout: "75%", // Creates the radial bar effect
            }]
        },
        options: {
            responsive: false,
            rotation: 270,
            circumference: 180, // Full circle
            plugins: {
                legend: {
                    position: "bottom",
                }
            }
        }
    };

    // Render chart as buffer (image)
    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

    return imageBuffer;
}

function getRiskColor(riskLevel) {
    switch (riskLevel) {
        case "Low": return "#00C851";
        case "Moderate-Low": return "#A2D729";
        case "Moderate": return "#FFC107";
        case "Moderate-High": return "#FF8C00";
        case "High": return "#FF4444";
        case "Very High": return "#CC0000";
        default: return "#000000";
    }
}

//#endregion

//#region asset allocation chart

//#endregion
module.exports = { getInvestmentGrowthChart, getAnnualizedReturnsChart, getRiskLevelChart };