import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';

const  db = await sqlite.open({
    filename:  './data_plan.db',
    driver:  sqlite3.Database
});

await db.migrate();


//get price plans
export async function getPricePlans(){
    const sql = await db.all(`select * from price_plan`)
    return sql
}
// get a specific plan
 export async function getSpecificPlan(plan_name){
    const sql = `select * from price_plan where plan_name = ?`
   return db.all(sql, [plan_name])
}

//add a new price plan
export async function addPricePlan(plan_name, sms_price, call_price){
    const sql = `insert into price_plan (plan_name, sms_price, call_price) values (?, ?, ?);`
    await db.run(sql, [plan_name, sms_price, call_price]);
}

// update a price plan
export async function updatePlan(sms_price, call_price, plan_name){
    const sql = `update price_plan set sms_price=?, call_price=? where plan_name=?`
    await db.run(sql, [sms_price, call_price, plan_name])
}

//delete price plan
export async function deletePricePlan(plan_name){
    const sql = `delete from price_plan where plan_name = ?`
    await db.run(sql, [plan_name])
} 

export async function deletePricePlanById(id){
    const sql = `delete from price_plan where id = ?`
    await db.run(sql, [id])
} 