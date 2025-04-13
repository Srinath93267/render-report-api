const express = require('express');
const app = express();

const fs = require('fs');
const puppeteer = require('puppeteer');
const config = require('./config');
const apiService = require('./apiService');
const chartService = require('./chartService');
var cors = require('cors')

app.use(cors({
    origin: config.cors
}))

app.get("/GetPortfolioPerformanceReport", (req, res, next) => {

    try {

        (async () => {

            const data = await apiService.getPortfolioPerformanceData(req.headers.account);

            // Chart configuration
            const investmentGrowthImageBuffer = await chartService.getInvestmentGrowthChart(data);
            const investmentGrowthbase64Image = `data:image/png;base64,${investmentGrowthImageBuffer.toString("base64")}`
            const annualizedReturnsImageBuffer = await chartService.getAnnualizedReturnsChart(data);
            const annualizedReturnsbase64Image = `data:image/png;base64,${annualizedReturnsImageBuffer.toString("base64")}`
            const riskLevelImageBuffer = await chartService.getRiskLevelChart(data);
            const riskLevelbase64Image = `data:image/png;base64,${riskLevelImageBuffer.toString("base64")}`

            // Path to your HTML file
            const htmlFilePath = './reports/portfolio-performance.html';

            // Read the HTML content from the file
            let htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');

            // Replace the placeholder with the chart image
            htmlContent = htmlContent.replace("InvestmentGrowthChart", investmentGrowthbase64Image);
            htmlContent = htmlContent.replace("AnnualizedReturnsChart", annualizedReturnsbase64Image);
            htmlContent = htmlContent.replace("RiskLevelChart", riskLevelbase64Image);
            htmlContent = htmlContent.replace("RiskLevelText", data.riskLevel);
            htmlContent = htmlContent.replace("TotalPortfolioValue", '₹' + data.totalPortfolioValue);
            htmlContent = htmlContent.replace("ClientName", data.clientName);
            htmlContent = htmlContent.replace("ReportDate", new Date().toLocaleDateString("en-GB"));

            // Launch Puppeteer
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            // Set the HTML content to the page
            await page.setContent(htmlContent, { waitUntil: 'load' });

            // Generate the PDF
            const pdfBuffer = await page.pdf({
                // path: 'output.pdf', // Output PDF file path
                format: 'A4', // Paper size,
                landscape: true, // Paper orientation
                printBackground: true, // Include background colors/images
            });

            // Close the browser
            await browser.close();

            const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');

            console.log("PDF generated successfully for the Account: " + req.headers.account + ", Time: " + new Date().toString().replace(/\.\w*/, ''));

            res.status(200).json({ Report: "data:application/pdf;base64," + pdfBase64 });
        })();
    }
    catch (error) {
        console.error(error);
        res.status(500).json(`Error generating PDF: ${error}`);
    }

});

app.get("/GetAssetAllocationReport", (req, res, next) => {

    try {

        (async () => {

            const data = await apiService.getAssetAllocationData(req.headers.account);

            // Chart configuration
            const allocationPercentageImageBuffer = await chartService.getAllocationPercentageChart(data);
            const allocationPercentagebase64Image = `data:image/png;base64,${allocationPercentageImageBuffer.toString("base64")}`;
            const historicalPerformanceImageBuffer = await chartService.getHistoricalPerformanceChart(data);
            const historicalPerformancebase64Image = `data:image/png;base64,${historicalPerformanceImageBuffer.toString("base64")}`;
            const targetAllocationPercentageImageBuffer = await chartService.getTargetAllocationPercentageChart(data);
            const targetAllocationPercentagebase64Image = `data:image/png;base64,${targetAllocationPercentageImageBuffer.toString("base64")}`;
            const volatilityRiskLevelImageBuffer = await chartService.getVolatilityRiskLevelChart(data);
            const volatilityRiskLevelbase64Image = `data:image/png;base64,${volatilityRiskLevelImageBuffer.toString("base64")}`;

            // Path to your HTML file
            const htmlFilePath = './reports/asset-allocation.html';

            // Read the HTML content from the file
            let htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');

            // Replace the placeholder with the chart image
            htmlContent = htmlContent.replace("AllocationPercentageChart", allocationPercentagebase64Image);
            htmlContent = htmlContent.replace("HistoricalPerformanceChart", historicalPerformancebase64Image);
            htmlContent = htmlContent.replace("TargetAllocationPercentageChart", targetAllocationPercentagebase64Image);
            htmlContent = htmlContent.replace("VolatilityRiskLevel", volatilityRiskLevelbase64Image);
            htmlContent = htmlContent.replace("ClientName", data.clientName);
            htmlContent = htmlContent.replace("ReportDate", new Date().toLocaleDateString("en-GB"));
            let table = "";
            for (let i = 0; i < data.assetClass.length; i++) {
                table = table + "<tr>" +
                    "<th scope=\"row\">" + data.assetClass[i] + "</th>" +
                    "<td>" + data.liquidityLevel[i] + "</td>" +
                    "<td>" + data.deviationFromTarget[i] + "</td>" +
                    "<td>" + data.dividendYield[i] + "</td>" +
                    "</tr>";
            }
            htmlContent = htmlContent.replace("varTable", table);
            // Launch Puppeteer
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            // Set the HTML content to the page
            await page.setContent(htmlContent, { waitUntil: 'load' });

            // Generate the PDF
            const pdfBuffer = await page.pdf({
                //path: 'output.pdf', // Output PDF file path
                format: 'A4', // Paper size,
                landscape: true, // Paper orientation
                printBackground: true, // Include background colors/images
            });

            // Close the browser
            await browser.close();

            const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');

            console.log("PDF generated successfully for the Account: " + req.headers.account + ", Time: " + new Date().toString().replace(/\.\w*/, ''));

            res.status(200).json({ Report: "data:application/pdf;base64," + pdfBase64 });
        })();
    }
    catch (error) {
        console.error(error);
        res.status(500).json(`Error generating PDF: ${error}`);
    }

});

exports.api = functions.https.onRequest(app);

// Uncomment the following lines to run the server locally
// app.listen(3001, () => {
//     console.log("Server running on port 3001");
// });

