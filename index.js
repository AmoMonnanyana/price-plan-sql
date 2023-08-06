import express from 'express';
import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';

const  db = await sqlite.open({
    filename:  './data_plan.db',
    driver:  sqlite3.Database
});

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

const result1 = await getPricePlans()
console.log(result1)
const result2 = await getSpecificPlan('amo_plan')
//await updatePlan(2.5, 3.49, 'call 201')
//await deletePricePlan('amo_plan')
//await addPricePlan('amo_plan', 1.49, 2.15)
console.log(result2)
console.log('end')