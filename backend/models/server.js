const express = require('express')
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser')

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.openAiAssitant = '/api/v1/assistant'

         // middlewares
         this.middlewares();
        
         // routes
         this.routes();
    }

    middlewares() {
        this.app.use( cors() );
        this.app.options( '*', cors() );
        this.app.use( express.static('public') );
        this.app.use(bodyParser.urlencoded({ extended: false }))
        this.app.use(bodyParser.json())
    }

    routes() {
        this.app.use( this.openAiAssitant , require('../routes/openAi.routes'));
    }

    listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`Example app listening on port ${this.port}`)
        })
    }
}

module.exports = Server;