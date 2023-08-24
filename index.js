import express from 'express';
import {getPricePlans, updatePlan, deletePricePlanById, addPricePlan, getSpecificPlan, getHistory, addBillHistory, deleteHistory} from './db.js';

import  totalPhoneBill from './totalPhoneBill.js';

const app = express();
app.use(express.static('public'))
app.use(express.json())

//await addBillHistory('sms 101', 'call, sms, call', 'R5.89')
//const result = await getHistory()
//await deleteHistory()
//console.log(result)

console.log('end')

//console.log(result2[0].call_price)


app.post('/api/phonebill', async function(req, res){
    const price_plan = req.body.price_plan
    const actions = req.body.actions

    let status = ""
    let message = ""
    let total = "R0.00"

    try {
    const payment_plan = await getSpecificPlan(price_plan)
    const call_cost = payment_plan[0].call_price
    const sms_cost = payment_plan[0].sms_price
    total = totalPhoneBill(actions, call_cost, sms_cost)
    await addBillHistory(price_plan, actions, total)

    status = "success"
    message = "Price name valid"

    } catch(err) {
    status = "failure"
    message = "Price name not valid!"

    }
    
    res.json({
            status,
            total,
            message

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
        message: `price plan with id=${id} deleted`
    })
})

app.get('/api/history', async function(req, res){
    const billHistory = await getHistory()
    res.json({
        billHistory
    })
})

app.post('/api/delete/history', async function(req, res){
    await deleteHistory()
    res.json({
        status : "Bill history successfully cleared!"
    })
})
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => `Server started ${PORT}`)

