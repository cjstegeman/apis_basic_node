3 voorbeeld files:

- basic_server.js
5 regels code waarin je met nodejs een webserver kan bouwen
runt op poort 8080 (http://localhost:8080)

- index.js
Basic API o.b.v. express met get request op customers 
Met MySQL DB connection op localhost
Runt op poort 2010 ( http://localhost:2010 of http://localhost:2010/getCustomers)
Geeft "platte" customers JSON terug

- index_nested.js
Gebaseerd op bovenstaande API o.b.v. express met get request op customers met gensete reservations 
Met MySQL DB connection op localhost
Runt op poort 2020 ( http://localhost:2020 of http://localhost:2010/getCustomersReservations of http://localhost:2010/getCustomersReservations2)
getCustomersReservations geeft geneste JSON d.m.v. 2 asynchrone calls op customers en reservations. Met JS wordt geneste JSON verder gemaakt
getCustomersReservations2 geeft geneste JSON d.m.v. 1 query met JOIN op beide tabellen. Met JS wordt geneste JSON verder gemaakt
Geeft "geneste" customers met jun reservations JSON terug