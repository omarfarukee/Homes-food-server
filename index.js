const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const { query } = require('express');
require('dotenv').config();
app.use(cors());
app.use(express.json());


// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASSWORD)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xdpsuxi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
        try{
            const foodsCollection = client.db('foodFor').collection('foods')

            app.get('/foods', async(req, res) =>{   
                const query ={}
                const cursor = foodsCollection.find(query);
                const foods = await cursor.toArray();
                res.send(foods)
            })
        }
        finally{

        }
}
run().catch(err => console.error(err))

app.get('/', (req, res) =>{
    res.send('homes foods in running ')
})

app.listen( port, () =>{
    console.log(`homes server on ${port}`)
})