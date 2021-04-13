const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer')
const fs = require('fs')
const db = require('./db');

app.use(express.static('public'))

app.use(cors());
app.use(bodyParser.json());


const authRoutes = express.Router();


app.get('/', function (req, res) {
    db.findAllUsers()
    res.send('GET request to the homepage')
})

app.get('/allSuppliers', function (req, res) {
    db.findAllSuppliers(req, res)
})

app.get('/supplierData/:supplierId', function (req, res) {
    db.findSupplierData(req, res)
})

app.post('/addSupplier',function(req, res) {
    db.insertSupplier(req, res).then(r => () => {
    })
})

app.delete('/deleteSupplier/:name',function(req, res) {
    db.deleteSupplier(req, res).then(r => () => {
    })
})

app.get('/allEmployees', function (req, res) {
    db.findAllEmployees(req, res)
})

app.post('/addEmployee',function(req, res) {
    db.insertEmployee(req, res)
})

app.delete('/deleteEmployee/:employeeId',function(req, res) {
    db.deleteEmployee(req, res)
})

app.get('/employeeData/:employeeId', function (req, res) {
    db.findEmployeeData(req, res)
})

authRoutes.route('/login').post(async function(req, res) {
    db.findUserByUsername(req, res).then(result => {
        console.log(result)
    }).catch(e => {
        console.log(e)
    });

});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname )

    }
})

const upload = multer({ storage: storage }).single('file')

app.post('/uploadInvoice',function(req, res) {
    console.log('uploadInvoice request...')
    try{
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json(err)
            } else if (err) {
                return res.status(500).json(err)
            }
            await db.insertInvoice(req, res)
            // return res.status(200).send(req.file)

        })
    }catch (err){
        console.log(err)
    }

    //save it in the db
});

app.delete('/deleteInvoice/:invoiceId',function(req, res) {
    const { invoiceId } = req.params;
    try {
        console.log(__dirname)
        fs.unlinkSync(__dirname + '/public/' +invoiceId)
        //file removed
    } catch(err) {
        console.error(err)
    }
    db.deleteInvoice(req, res)
})


authRoutes.route('/login').post(async function(req, res) {
    db.findUserByUsername(req, res).then(result => {
        console.log('ciao')
    }).catch(e => {
        console.log(e)
    });

});

authRoutes.route('/register').post(function(req, res) {
    db.insertUser(req, res).then(result => {
        db.findAllUsers()
    }).catch(e => {
        console.log(e)
    });
});


app.use('/auth', authRoutes);

module.exports = app;