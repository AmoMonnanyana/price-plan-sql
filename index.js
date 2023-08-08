import express from 'express';
import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import  totalPhoneBill from './totalPhoneBill.js';

const app = express();
app.use(express.static('public'))
app.use(express.json())

const  db = await sqlite.open({
    filename:  './data_plan.db',
    driver:  sqlite3.Database
});

await db.migrate();

console.log('start')

//get price plans
async function getPricePlans(){
    const sql = await db.all(`select * from price_plan`)
    return sql
}
// get a specific plan
async function getSpecificPlan(plan_name){
    const sql = `select * from price_plan where plan_name = ?`
   return db.all(sql, [plan_name])
}

//add a new price plan
async function addPricePlan(plan_name, sms_price, call_price){
    const sql = `insert into price_plan (plan_name, sms_price, call_price) values (?, ?, ?);`
    await db.run(sql, [plan_name, sms_price, call_price]);
}

// update a price plan
async function updatePlan(sms_price, call_price, plan_name){
    const sql = `update price_plan set sms_price=?, call_price=? where plan_name=?`
    await db.run(sql, [sms_price, call_price, plan_name])
}

//delete price plan
async function deletePricePlan(plan_name){
    const sql = `delete from price_plan where plan_name = ?`
    await db.run(sql, [plan_name])
} 

async function deletePricePlanById(id){
    const sql = `delete from price_plan where id = ?`
    await db.run(sql, [id])
} 

const result1 = await getPricePlans()
console.log(result1)
const result2 = await getSpecificPlan('call 201')
//await deletePricePlanById(4)
//await updatePlan(2.5, 3.49, 'call 201')
//await deletePricePlan('amo_plan')
//await addPricePlan('amo_plan', 1.49, 2.15)
console.log(result2)
console.log('end')

console.log(result2[0].call_price)
/*app.get('/api/phonebill', async function(req, res){
const plan_name = req.query.plan_name
const plan = await getSpecificPlan(plan_name)

res.json({
plan

})
})*/


const allTotals = {}

app.post('/api/phonebill', async function(req, res){
    const price_plan = req.body.price_plan
    const actions = req.body.actions

    const payment_plan = await getSpecificPlan(price_plan)
    const call_cost = payment_plan[0].call_price
    const sms_cost = payment_plan[0].sms_price
    const total = totalPhoneBill(actions, call_cost, sms_cost)

    allTotals[price_plan] = total
    
    res.json({
        status: "success",
        total

    })
})

app.get('/api/price_plans/',async  function(req, res){
    const price_plans = await getPricePlans()
    res.json({
        price_plans
    })
})

app.post('/api/price_plan/create', async function(req, res){
    const name = req.body.name
    const call_cost = req.body.call_cost
    const sms_cost = req.body.sms_cost
    await addPricePlan(name, sms_cost, call_cost)

    res.json({
        status: "success",
        message: "New price plan added"
    })
})

app.post('/api/price_plan/update', async function(req, res){
    const name = req.body.name
    const call_cost = req.body.call_cost
    const sms_cost = req.body.sms_cost
    await updatePlan(sms_cost, call_cost, name)

    res.json({
        status: "success",
        message: "Price plan updated"
    })
})

app.post('/api/price_plan/delete', async function(req, res){
    const id = req.body.id
    await deletePricePlanById(id)
    res.json({
        status: "success",
        message: "price plan deleted"
    })
})

app.get('/api/history', function(req, res){
    res.json({
        allTotals
    })
})
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => `Server started ${PORT}`)

