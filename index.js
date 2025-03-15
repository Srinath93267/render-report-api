const express = require('express');
const app = express();

const fs = require('fs');
const puppeteer = require('puppeteer');
const apiService = require('./apiService');
const chartService = require('./chartService');

app.get("/GetPortfolioPerformanceReport", (req, res, next) => {

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
        htmlContent = htmlContent.replace("TotalPortfolioValue", '₹'+data.totalPortfolioValue);
        htmlContent = htmlContent.replace("ReportDate", new Date().toLocaleDateString("en-GB"));

        // Launch Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Set the HTML content to the page
        await page.setContent(htmlContent, { waitUntil: 'load' });

        // Generate the PDF
        await page.pdf({
            path: 'output.pdf', // Output PDF file path
            format: 'A4', // Paper size,
            landscape: true, // Paper orientation
            printBackground: true, // Include background colors/images
        });

        // Close the browser
        await browser.close();

        res.status(200).json(`PDF created successfully: output.pdf`);
    })();

});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

