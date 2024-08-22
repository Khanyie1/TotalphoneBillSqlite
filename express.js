import express from 'express'
import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.static('public'))
app.use(express.json())

app.get('/api/khanyie/price_plans/', async function(req, res){
    const plans = await db.all('select * from price_plan');
    res.json(plans);
})

app.post('/api/khanyie/price_plan/create/', async function(req, res){
    const { name, call_cost, sms_cost } = req.body;

    await db.run("insert into price_plan (plan_name, call_price, sms_price) values (?, ?, ?)", name, call_cost, sms_cost);

    res.status(201).json({ message: 'Price plan created successfully' });
})

app.post('/api/khanyie/price_plan/update/', async function(req, res){
    const { name, call_cost, sms_cost, id } = req.body;

    await db.run
        ("update price_plan set call_price = ? , sms_price = ?, plan_name = ? where id = ?", 
        call_cost, sms_cost, name, id
        );
        res.json({ message: 'Price plan updated successfully' });
})

app.post('/api/khanyie/price_plan/calculatePhoneBill/', async function(req, res) {
    const { price_plan, actions } = req.body;

    if (!price_plan || !actions) {
        return res.status(400).json({ error: 'Missing price_plan or actions in request body' });
    }

    const price_plan_variable = '?'
    const plan = await db.get(`select * from price_plan where plan_name = ${price_plan_variable}`, price_plan);
    if (!plan) {
        return res.status(404).json({ error: 'Price plan not found' });
    }

    const actionList = actions.split(",");
    let total = 0;

    actionList.forEach(action => {
        if (action.trim() === 'sms') {
            total += plan.sms_price;
        } else if (action.trim() === 'call') {
            total += plan.call_price;
        }
    });

    res.json({ total: total.toFixed(2) });
})

app.post('/api/khanyie/price_plan/delete/', async function(req, res){
    const { id } = req.body;

    const ids = 5;

    await db.run(`delete from price_plan where id = ?`, id);

    res.json({ message: 'Price plan deleted successfully' });
})

const  db = await sqlite.open({
    filename:  './data_plan.db',
    driver:  sqlite3.Database
});

await db.migrate();

let PORT = process.env.port || 3013
app.listen(PORT, function() {
    console.log(`App runing on port: ${PORT}`)
})