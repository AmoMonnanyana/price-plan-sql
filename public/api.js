document.addEventListener('alpine:init', () => {
    Alpine.data('phoneBill', function() {
      return {
        totalPhoneBill: '',
        price_plan: '',
        actions: '',
        allPricePlans : [],
        newPlanName: '',
        newSmsCost: 0,
        newCallCost: 0,
        newMessage: '',
        updatename: '',
        updateSmsCost: 0,
        updateCallCost: 0,
        updateMessage: '',
        planId: 0,
        deleteMessage: '',
        billHistory: [],
        thePlans: [],

        calculateBill(){
           return axios.post(`/api/phonebill`, {
                "price_plan" : this.price_plan,
                "actions" : this.actions
            }).then((result) => {
                this.totalPhoneBill = result.data.total
                //console.log(result.data)
                //this.billHistory.push(this.totalPhoneBill)
                
            })
        },
        getAllPricePlans(){
           return  axios.get(`/api/price_plans/`)
           .then((result) => {
           // console.log(result.data)
            this.allPricePlans = result.data.price_plans
            //console.log(this.allPricePlans)
            //console.log(this.allPricePlans[0])
            
           })
        },

        addNewPlan(){
            return axios.post(`/api/price_plan/create`, {
                "name" : this.newPlanName,
                "call_cost" : this.newCallCost,
                "sms_cost" : this.newSmsCost
            }).then((result) =>{
                this.newMessage = result.data.message
            })
        },
        updatePlan(){
            return axios.post(`/api/price_plan/update`, {
                "name" : this.updatename,
                "call_cost" : this.updateCallCost,
                "sms_cost" : this.updateSmsCost
            }).then((result) => {
                this.updateMessage = result.data.message
            })
        },
    
        deletePlan(){
            return axios.post(`/api/price_plan/delete`, {
                "id" : this.planId
            }).then((result) => {
                this.deleteMessage = result.data.message
            })
        },

        getBillHistory (){
            return axios.get(`/api/history`)
            .then((result) => {
                this.billHistory = result.data.allTotals
                this.thePlans =  Object.keys(this.billHistory)
                console.log(this.billHistory)
                console.log(this.thePlans)
               
            })
        }
      }
    })
})