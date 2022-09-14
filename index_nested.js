/* ----- start ---- require modules, opzetten app o.b.v. express, start server en connect DB (inhoud van index.js)-- */
const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 2020;

app.listen(port, () => {
    console.log(`Deze app is te bereiken op: http://localhost:${port}`);
});

app.use(express.urlencoded({ extended: true, })); //parses all the urlencoded bodies

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
app.get("/getCustomers", (req, res) => {
    // gebruik con (connection met jouw database) om query te kunnen schrijven
    con.query("SELECT * FROM customers LIMIT 5", function (err, customers, fields) {
        if (err) throw err;
        //console.log("customers", customers)
        res.json(customers);  // geef json out put op endpoint "/api/customers"
    });
});

// endpoint voor geneste customers met reservations (optie 1: haal beide tabellen apart op en maak de nested output met js)
app.get("/getCustomersReservations", (req, res) => {
    (async () => {
        try {
            // laadt customers en reservations in met await vanuit asynchrone functie
            // voordeel van gebruik await: hij wacht tot customers zijn geladen en dan gaat het script pas verder
            const customers = await getCustomers();
            const reservations = await getReservations();
            // console.log("customers=", customers, "reservations=", reservations);

            customers.forEach(customer => {
                // als de reservation-array in het object customer nog niet bestaat, maak hem dan aan (lege array)
                if (!customer.reservation) customer.reservation = []

                reservations.forEach(reservation => {
                    // als de reservation van de huidige customer is, push dan die reservation in de array customer.reservation
                    if (customer.id == reservation.customer_id) {
                        customer.reservation.push(reservation)
                    }
                })

            })
            res.json(customers);
        } finally {
            //conn.end();
        }
    })()

    // endpoint voor geneste customers met reservations (optie 2: vanuit sql output van customers-JOIN-reservations)
    app.get("/getCustomersReservations2", (req, res) => {
        // gebruik con (connection met jouw database) om query te kunnen schrijven
        const sql = ` SELECT * FROM customers c 
                      INNER JOIN reservations r 
                        on c.id = r.customer_id 
                      ORDER BY c.id;`
        con.query(sql, function (err, custs_ress, fields) {
            if (err) throw err;
            //console.log("customers", customers)
            let customers_nested = []
            custs_ress.forEach(customer_ress => {
                // 
                const searchCustomer = customers_nested.find((cust) => cust.id == customer_ress.customer_id);
                if (!searchCustomer) {
                    //als deze customer nog niet bestaat in de nieuwe array customers_nested, push dan een nieuwe array met customer eigenschappen
                    customers_nested.push(
                        {
                            id: customer_ress.customer_id,
                            first_name: customer_ress.first_name,
                            last_name: customer_ress.last_name,
                            email: customer_ress.email,
                            // voeg de array "reservations" toe met de reservation die nu in customer_ress staat
                            reservations: [
                                {
                                    trip_id: customer_ress.trip_id,
                                    reservation_date: customer_ress.reservation_date,
                                    number_of_adults: customer_ress.number_of_adults,
                                    number_of_children: customer_ress.number_of_children,
                                    paid: customer_ress.paid,
                                }
                            ]
                        }
                    )
                } else {
                    //als de customer al wel bestaat, push dan alleen de reservation van customer_ress in reservations
                    searchCustomer.reservations.push(
                        {
                            trip_id: customer_ress.trip_id,
                            reservation_date: customer_ress.reservation_date,
                            number_of_adults: customer_ress.number_of_adults,
                            number_of_children: customer_ress.number_of_children,
                            paid: customer_ress.paid,
                        }
                    )
                }
            })
            res.json(customers_nested);
        });
    });

    /* FOUTE UITWERKING DOOR NESTEN VAN 2 PROMISSES
        con.query("SELECT * FROM customers LIMIT 5", function (err, customers, fields) {
        if (err) throw err;
        console.log("customers", customers)

        //ONDERSTAANDE GAAT FOUT OMDAT reservations asynchroon (later) geladen worden en customer nog zonder reservations alweer wordt terug gegeven
        customers.forEach(customer => {
            //console.log(customer);
            con.query("SELECT * FROM reservations WHERE customer_id=" + customer.id, function (err, reservation, fields) {
                if (err) throw err;
                console.log("reservation", reservation)
                if (!customer.reservation)
                    customer.reservation = []
                customer.reservation.push(reservation)
            })

        });
        res.json(customers);  // geef json out put op endpoint "/api/customers"
    }); */
});

app.get("/", (req, res) => {
    res.send('Dit is voorbeeld van<br>- een simpele rest-API (via Express) <br>- met mysql database connectie');
});
/* ----- stop ------- endpoints ------------------------------------------------------------------------------------ */


/* ----- start ------ asynchrone hulp functies voor ophalen data, die met await ingeladen kan worden --------------- */
async function getCustomers() {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM customers`;
        con.query(sql, (err, result, field) => {
            if (err) return reject(err);
            resolve(Object.values(result));
        });
    });
}

async function getReservations() {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM reservations`;
        con.query(sql, (err, result, field) => {
            if (err) return reject(err);
            resolve(Object.values(result));
        });
    });
}
/* ----- stop ------- asynchrone hulp functies voor ophalen data, die met await ingeladen kan worden --------------- */

//test async zonder query, met timeout
/* async function myFunc() {
    // Await for the promise to resolve
    await new Promise((resolve) => {
        setTimeout(() => {
            // Resolve the promise
            resolve(console.log('hello'));
        }, 1000);
    });
    // Once the promise gets resolved continue on
    console.log('hi');
} */

