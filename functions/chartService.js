const { ChartJSNodeCanvas } = require("chartjs-node-canvas");

// Chart size
const width = 280;
const height = 280;

const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width, height,
    plugins: {
        modern: ["chartjs-plugin-datalabels"] // Register the plugin
    }
});

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
    const riskLevels = ["Low", "Moderate-Low", "Moderate", "Moderate-High", "High", "Very High"];
    const riskLevelPercentage = (riskLevels.indexOf(data.riskLevel) + 1) * 16.67;
    const configuration = {
        type: "doughnut", // Doughnut chart mimics radial bars
        data: {
            labels: [],
            datasets: [{
                data: [riskLevelPercentage, 100 - riskLevelPercentage], // Portfolio allocation percentages
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
                },
                datalabels: {
                    display: false
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
async function getAllocationPercentageChart(data) {

    const configuration = {
        type: "pie", // Pie chart type
        data: {
            labels: data.assetClass,
            datasets: [{
                data: data.allocationPercentage, // Sample data
                backgroundColor: ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0"], // Slice colors
                borderWidth: 2
            }]
        },
        options: {
            responsive: false,
            plugins: {
                legend: {
                    position: "bottom",
                },
                datalabels: {
                    color: "#fff", // Label color
                    formatter: (value, context) => {
                        let total = context.dataset.data.reduce((sum, num) => sum + num, 0);
                        let percentage = ((value / total) * 100).toFixed(1) + "%";
                        return percentage; // Show percentage
                    },
                    font: {
                        weight: "bold",
                        size: 14
                    }
                },
                title: {
                    display: true,
                    text: "Allocation Percentage", // Chart Title
                    font: {
                        size: 18,
                        weight: "bold"
                    },
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                }
            }
        }
    };

    // Render chart as buffer (image)
    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

    return imageBuffer;
}

async function getHistoricalPerformanceChart(data) {

    const configuration = {
        type: "bar",
        data: {
            labels: data.assetClass, // X-axis labels
            datasets: [
                {
                    label: "Historical Performance 3 Years",
                    data: data.historicalPerformance3Y, // First dataset
                    backgroundColor: "rgba(54, 162, 235, 0.7)", // Blue color
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1
                },
                {
                    label: "Historical Performance 5 Years",
                    data: data.historicalPerformance5Y, // Second dataset
                    backgroundColor: "rgba(255, 99, 132, 0.7)", // Red color
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: false,
            scales: {
                x: {
                    stacked: false, // Prevents stacking, so bars appear side-by-side
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    };


    // Render chart as buffer (image)
    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

    return imageBuffer;
}

async function getTargetAllocationPercentageChart(data) {

    const configuration = {
        type: "doughnut", // Pie chart type
        data: {
            labels: data.assetClass,
            datasets: [{
                data: data.targetAllocationPercentage, // Sample data
                backgroundColor: ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0"], // Slice colors
                borderWidth: 2
            }]
        },
        options: {
            responsive: false,
            plugins: {
                legend: {
                    position: "bottom",
                },
                datalabels: {
                    color: "#fff", // Label color
                    formatter: (value, context) => {
                        let total = context.dataset.data.reduce((sum, num) => sum + num, 0);
                        let percentage = ((value / total) * 100).toFixed(1) + "%";
                        return percentage; // Show percentage
                    },
                    font: {
                        weight: "bold",
                        size: 14
                    }
                },
                title: {
                    display: true,
                    text: "Target Allocation Percentage", // Chart Title
                    font: {
                        size: 18,
                        weight: "bold"
                    },
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                }
            }
        }
    };

    // Render chart as buffer (image)
    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

    return imageBuffer;
}

async function getVolatilityRiskLevelChart(data) {

    const data2 = {
        labels: data.assetClass,
        datasets: [{
            label: "Performance",
            data: [30, 60, 90, 120], // Example values
            backgroundColor: ["#008FFB", "#00E396", "#FEB019", "#FF4560"],
            borderWidth: 1
        }]
    };

    const configuration = {
        type: "bar",
        data: data2,
        options: {
            indexAxis: "y", // Makes it a horizontal bar chart
            responsive: false,
            scales: {
                y: {
                    reverse: true, // Reverses the order of the bars
                    title: {
                        display: true,
                        text: "Categories"
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: "Values"
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // Hide legend (optional)
                },
                title: {
                    display: true,
                    text: "Volatility Risk Level",
                    font: {
                        size: 18,
                        weight: "bold"
                    },
                    padding: { top: 10, bottom: 20 }
                }
            }
        }
    };

    // Render chart as buffer (image)
    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

    return imageBuffer;
}

//#endregion
module.exports = {
    getInvestmentGrowthChart,
    getAnnualizedReturnsChart,
    getRiskLevelChart,
    getAllocationPercentageChart,
    getHistoricalPerformanceChart,
    getTargetAllocationPercentageChart,
    getVolatilityRiskLevelChart
};