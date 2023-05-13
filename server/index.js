const express = require ('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
//const MongoClient = require('mongodb').MongoClient;
const parameterRoutes = require('./routes/parameters')
const os = require('os');
const interfaces = os.networkInterfaces();
let ip_address;

for (let k in interfaces) {
    for (let k2 in interfaces[k]) {
        let address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            ip_address = address.address;
            break;
        }
    }
}

console.log(ip_address);

//middleware
app.use(express.json());
app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.use(require("./routes/parameters"))


//routes
app.use('/api/realm', parameterRoutes)



//setup mongoose connection ZSt6kE8TzgVq92jt
mongoose.set('strictQuery', true)
const mongodbConnString = "mongodb+srv://realmadmin:ZSt6kE8TzgVq92jt@realmcluster.ole0mns.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(mongodbConnString, {useNewUrlParser: true,
    useUnifiedTopology: true})

mongoose.connection.on("error", function(error) {
    console.log(error)
})

mongoose.connection.on("open", function() {
    console.log("Successfully established connection.")
})


//port
app.listen(8080, () => {
    console.log ('Server running!')
})