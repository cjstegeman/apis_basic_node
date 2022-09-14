/* ----- start ---- require modules, opzetten app o.b.v. express, start server en connect DB (inhoud van index.js)-- */
const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 2010;

app.listen(port, () => {
    console.log(`Deze app is te bereiken op: http://localhost:${port}`);
});

// app.use(express.urlencoded({ extended: true, })); //parses all the urlencoded bodies

// set up database connection MySQL
const con = mysql.createConnection({
    host: "localhost", user: "root", password: "", database: "reisbureau"
});

// connect to database
con.connect(function (err) {
    if (err) throw err;
    console.log("Database connected!"); 
});
/* ----- stop ---- require modules, opzetten app o.b.v. express, start server en connect DB (inhoud van index.js) -- */


/* ----- start ------ endpoints ------------------------------------------------------------------------------------ */
app.get("/", (req, res) => {
    res.send('Dit is voorbeeld van<br>- een simpele rest-API (via Express) <br>- met mysql database connectie');
});

app.get("/getCustomers", (req, res) => {
    // gebruik con (connection met jouw database) om query te kunnen schrijven
    con.query("SELECT * FROM customers LIMIT 5", function (err, customers, fields) {
        if (err) throw err;
        //console.log("customers", customers)
        res.json(customers);  // geef json out put op endpoint "/api/customers"
    });
}); 
/* ----- stop ------- endpoints ------------------------------------------------------------------------------------ */