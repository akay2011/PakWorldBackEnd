const sql = require('mssql')
var jwt = require('jsonwebtoken');

var config = require('./config');

// config for your database
const dbConfig = {
    user: 'user_db_1612407_managmentsystems',
    password: 'Depsteck38@',
    server: 'SQL2016.fse.network',
    database: 'db_1612407_managmentsystems'
};

async function findUserByUsername(req, res){
    const username = req.body.userName
    const password = req.body.password
    let connection = new sql.ConnectionPool(dbConfig, function(err) {
        let r = new sql.Request(connection);
        r.input('username', sql.VarChar, username);
        r.input('password', sql.VarChar, password);
        r.query("SELECT * FROM dbo.users WHERE username=@username AND password=@password", function(err, recordsets) {
            if(err){
                console.log(err)
                res.status(500).send({ auth: false});
            } else {
                if(recordsets.recordset[0]){
                    try{
                        let buff = new Buffer(recordsets.recordset[0].username + recordsets.recordset[0].password + config.secret);
                        let base64User = buff.toString('base64');

                        const token = jwt.sign({ id: recordsets.recordset[0].username }, config.secret, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        res.status(200).send({ auth: true, token: token, user: base64User });
                    }
                    catch (error){
                        res.status(500).send({ auth: false});
                    }

                }else {
                    res.status(500).send({ auth: false});
                }

            }
            connection.close();
        });
    });

}

async function insertUser(req, res){
    const username = req.body.userName
    const password = req.body.password
    let connection = new sql.ConnectionPool(dbConfig, function(err) {
        let r = new sql.Request(connection);
        r.input('username', sql.VarChar, username);
        r.input('password', sql.VarChar, password);
        r.multiple = true;
        r.query("INSERT INTO dbo.users (username, password) VALUES (@username, @password)", function(err, recordsets) {
            if(err){
                console.log(err)
                res.status(500)
            } else {
                res.status(200)
            }
            connection.close();
            res.end()
        });
    });
}


async function insertInvoice(req, res){
    // const supplier_id = req.body.supplierId
    try{
        const supplier_id = req.body.supplierId;
        let connection = new sql.ConnectionPool(dbConfig, function(err) {
            let r = new sql.Request(connection);
            r.input('supplierid', sql.VarChar, supplier_id);
            r.input('image_url', sql.VarChar, req.file.filename);
            r.multiple = true;
            r.query("INSERT INTO dbo.in_voices (supplierid, image_url) VALUES (@supplierid, @image_url)", function(err, recordsets) {
                if(err){
                    console.log(err)
                    res.status(500)
                } else {
                    res.status(200)
                }
                connection.close();
                res.end()
            });
        });
    }
    catch (err){
        console.log("error inserting Invoice: " + err)
    }

}

async function deleteInvoice(req, res) {
    try{
        const { invoiceId } = req.params;
        let connection = new sql.ConnectionPool(dbConfig, function(err) {
            let r = new sql.Request(connection);
            r.input('image_url', sql.VarChar, invoiceId);
            r.multiple = true;
            r.query("DELETE FROM dbo.in_voices WHERE image_url = @image_url", function(err, recordsets) {
                if(err){
                    console.log(err)
                    res.status(500)
                    res.end()
                } else {
                    res.status(200)
                    res.end()
                }
                connection.close();
            });
        });
    }
    catch (err){
        console.log("error deleting Invoice: " + err)
    }
}

async function insertSupplier(req, res){
    const supplierName = req.body.supplier_name
    const supplierAddress = req.body.supplier_address
    const supplierContactNumber = req.body.supplier_contact_number
    let connection = new sql.ConnectionPool(dbConfig, function(err) {
        let r = new sql.Request(connection);
        r.input('name', sql.VarChar, supplierName);
        r.input('address', sql.VarChar, supplierAddress);
        r.input('contact_number', sql.VarChar, supplierContactNumber);
        r.multiple = true;
        r.query("INSERT INTO dbo.supplier (name, address, contact_number) VALUES (@name, @address, @contact_number)", function(err, recordsets) {
            if(err){
                console.log(err)
                res.status(500)
            } else {
                res.status(200)
            }
            connection.close();
            res.end()
        });
    });
}

async function deleteSupplier(req, res){
    const { name } = req.params;
    let connection = new sql.ConnectionPool(dbConfig, function(err) {
            let r = new sql.Request(connection);
            r.input('name', sql.VarChar, name);
            r.query("SELECT * FROM dbo.supplier WHERE name=@name", function(err, recordsets) {
                if(err){
                    return {}
                } else {
                    if(recordsets.recordset[0]){
                        const supplier = recordsets.recordset[0]
                        let r = new sql.Request(connection);
                        r.input('supplierid', sql.VarChar, supplier.supplierid);
                        r.multiple = true;

                        r.query("DELETE FROM dbo.in_voices WHERE supplierid = @supplierid", function(err, recordsets) {
                            if(err){
                                console.log(err)
                                res.status(500)
                            } else {
                                let r = new sql.Request(connection);
                                r.input('name', sql.VarChar, name);
                                r.multiple = true;
                                r.query("DELETE FROM dbo.supplier WHERE name = @name", function(err, recordsets) {
                                    if(err){
                                        console.log(err)
                                        res.status(500)
                                    } else {
                                        res.status(200)
                                    }
                                    connection.close();
                                    res.end()
                                });
                            }
                            res.end()
                        });
                    }else {
                        connection.close();
                        return {}
                    }

                }
            });
    });
}

function findAllSuppliers(req, res){
    let connection = new sql.ConnectionPool(dbConfig, function(err) {
        let r = new sql.Request(connection);

        r.query("SELECT * from dbo.supplier", function(err, recordsets) {
            if(err){
                console.log(err)
                res.status(500);
                res.end();
            }

            console.log(recordsets)
            res.status(200).send(recordsets.recordset);
            res.end();
            connection.close();
        });
        return ''
    });
}

function findSupplierData(req, res){
    const { supplierId } = req.params;

    let connection = new sql.ConnectionPool(dbConfig, function(err) {
        let r = new sql.Request(connection);
        r.input('supplierid', sql.Int, supplierId);
        r.multiple = true;


        r.query("SELECT [name], [address], [contact_number] FROM dbo.supplier WHERE supplierid=@supplierid", function(err, recordsets) {
            if(err){
                console.log(err)
                res.status(500);
                res.end();
            }

            let supplierInfo = recordsets.recordset[0];

            r.query("SELECT [invoiceid], [image_url] FROM dbo.in_voices WHERE supplierid=@supplierid", function(err, recordsets) {
                if(err){
                    console.log(err)
                    res.status(500);
                    res.end();
                }

                console.log(supplierInfo)
                console.log(recordsets)
                const response = {
                    ...supplierInfo,
                    invoices: recordsets.recordset
                }
                res.status(200).send(response);
                res.end();
                connection.close();
            });
        });


        return ''
    });
}

function findAllUsers(){
    let connection = new sql.ConnectionPool(dbConfig, function(err) {
        let r = new sql.Request(connection);

        r.query("SELECT * from dbo.suppliers", function(err, recordsets) {
            if(err){
                console.log(err)
            }
            console.log(recordsets)
            connection.close();
        });
        return ''
    });
}

function findAllEmployees(req, res) {
    let connection = new sql.ConnectionPool(dbConfig, function(err) {
        let r = new sql.Request(connection);

        r.query("SELECT * from dbo.employee", function(err, recordsets) {
            if(err){
                console.log(err)
                res.status(500);
                res.end();
            }

            res.status(200).send(recordsets.recordset);
            res.end();
            connection.close();
        });
        return ''
    });
}

function insertEmployee(req, res) {
    const employeeLastname = req.body.lastname
    const employeeFirstname = req.body.firstname
    const employeeAddress = req.body.address
    const employeeCity = req.body.city
    const employeeAge = req.body.age

    let connection = new sql.ConnectionPool(dbConfig, function(err) {
        let r = new sql.Request(connection);
        r.input('LastName', sql.VarChar, employeeLastname);
        r.input('FirstName', sql.VarChar, employeeFirstname);
        r.input('Address', sql.VarChar, employeeAddress);
        r.input('City', sql.VarChar, employeeCity);
        r.input('Age', sql.VarChar, employeeAge);
        r.multiple = true;
        r.query("INSERT INTO dbo.employee (LastName, FirstName, Address, City, Age) VALUES (@LastName, @FirstName, @Address, @City, @Age);", function(err, recordsets) {
            if(err){
                console.log(err)
                res.status(500)
            } else {
                res.status(200)
            }
            connection.close();
            res.end()
        });
    });
}

function deleteEmployee(req, res) {
    try{
        const { employeeId } = req.params;
        let connection = new sql.ConnectionPool(dbConfig, function(err) {
            let r = new sql.Request(connection);
            r.input('employeeID', sql.VarChar, employeeId);
            r.multiple = true;
            r.query("DELETE FROM dbo.employee WHERE employeeID = @employeeID", function(err, recordsets) {
                if(err){
                    console.log(err)
                    res.status(500)
                    res.end()
                } else {
                    //no employee with the provided ID
                    if(recordsets.rowsAffected[0] == 0){
                        res.status(500)
                    }else{
                        res.status(200)
                    }

                    res.end()
                }
                connection.close();
            });
        });
    }
    catch (err){
        console.log("error deleting Invoice: " + err)
    }
}

function findEmployeeData(req, res){
    const { employeeId } = req.params;
    let connection = new sql.ConnectionPool(dbConfig, function(err) {
        let r = new sql.Request(connection);
        r.input('employeeID', sql.VarChar, employeeId);
        r.query("SELECT * FROM dbo.employee WHERE employeeID=@employeeID", function(err, recordsets) {
            if(err){
                console.log(err)
                res.status(500)
            } else {
                if(recordsets.recordset[0]){
                    res.status(200).send(recordsets.recordset[0]);
                }else {
                    res.status(500);
                }
                res.end()
            }
            connection.close();
        });
    });

}

exports.findUserByUsername = findUserByUsername;
exports.insertUser = insertUser;
exports.findAllUsers = findAllUsers;
exports.insertInvoice = insertInvoice;
exports.deleteInvoice = deleteInvoice;
exports.findAllSuppliers = findAllSuppliers;
exports.insertSupplier = insertSupplier;
exports.deleteSupplier = deleteSupplier;
exports.findSupplierData = findSupplierData;
exports.insertEmployee = insertEmployee;
exports.findAllEmployees = findAllEmployees;
exports.deleteEmployee = deleteEmployee;
exports.findEmployeeData = findEmployeeData;
