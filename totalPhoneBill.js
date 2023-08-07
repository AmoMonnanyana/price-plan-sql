export default function totalPhoneBill(list, call_cost, sms_cost){
	let phoneBill = list.split(',');
  //console.log(phoneBill)
  let cost = 0; 
	for ( let i = 0; i < phoneBill.length; i++){
   		let bill = phoneBill[i].trim();
      //console.log(bill)
		if (bill == "call"){
			cost = cost + call_cost;
		} else if (bill == "sms"){
			cost = cost + sms_cost;
		}
	}
  return "R" + cost.toFixed(2);
  
}