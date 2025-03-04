const express = require('express');
const app = express();
const port = 3000;

// Configure your database connection
const sql = require('mssql');
const config = {
    user: '****',
    password: '*****',
    server: 'localhost',
    database: '*****',
    options: {
        enableArithAbort: true,
        trustServerCertificate: true,
    },
};

// Define the route to handle the calculation
app.get('/calculateWeeklyHours', async (req, res) => {
    const employeeId = req.query.employeeId;

    try {
        await sql.connect(config);
        const result = await sql.query`
            EXEC CalculateWeeklyHours
                @EmployeeId = ${employeeId},
                @StartDate = '2023-12-21',
                @EndDate = '2024-01-20';
        `;
        res.json(result.recordset);
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        sql.close();
    }
});

// Serve the HTML file
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
