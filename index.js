import express from 'express';
import {getPricePlans, updatePlan, deletePricePlanById, addPricePlan, getSpecificPlan} from './db.js';

import  totalPhoneBill from './totalPhoneBill.js';

const app = express();
app.use(express.static('public'))
app.use(express.json())

const result1 = await getPricePlans()
//console.log(result1)
const result2 = await getSpecificPlan('call 501')
  console.log(result2)


console.log('end')

//console.log(result2[0].call_price)


const allTotals = {}
const listOfBills = {}
let countBills = 0

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
    countBills++
    let thePlan = `${countBills}_bill-${price_plan}`
    let eachPlan = `${countBills}_${price_plan}`
    allTotals[eachPlan] = total
    listOfBills[thePlan] = actions

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

app.get('/api/history', function(req, res){
    res.json({
        allTotals,
        listOfBills
    })
})
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => `Server started ${PORT}`)

