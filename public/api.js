document.addEventListener('alpine:init', () => {
    Alpine.data('phoneBill', function() {
      return {
        totalPhoneBill: '',
        price_plan: '',
        actions: '',
        submittedList: '',
        allPricePlans : [],
        newPlanName: '',
        newSmsCost:'',
        newCallCost: '',
        newMessage: '',
        updatename: '',
        updateSmsCost: '',
        updateCallCost: '',
        updateMessage: '',
        planId: '',
        deleteMessage: '',
        billHistory: [],
        thePlans: [],
        viewPlans: false,
        listOfBills: [],
        showHistory: false,
        showTotal: false,
        countBills: 0,
        failureMessage: '',
        totalFail: false,
        deleteHistoryMessage: '',
        deleteFail: '',
        updateFail: '',
        newPlanFail: '',
        totalBillFail: '',
        emptyTable: '',

        calculateBill(){
            if(this.price_plan && this.actions) {
                return axios.post(`/api/phonebill`, {
                "price_plan" : this.price_plan,
                "actions" : this.actions
                }).then((result) => {
                
                if(result.data.status == "success") {
                this.totalPhoneBill = result.data.total
                localStorage['actions'] = this.actions
                this.showTotal = true
                this.countBills++
                console.log(result.data.total)
                } else if (result.data.status == "failure") {
                    this.failureMessage = result.data.message
                    this.totalFail = true
                }
                
                setTimeout(() => {
                    this.price_plan = ''
                    this.actions = ''
                    this.totalPhoneBill = ''
                    this.showTotal = false
                    this.totalFail = false
                    this.failureMessage = ''
                  }, 3000)
            })
            } else {
                this.totalBillFail = "Plan name and phone log required!" 
                setTimeout(() => {
                    this.totalBillFail = ''
                  }, 3000)
            }
           
        },
        getAllPricePlans(){
           return  axios.get(`/api/price_plans/`)
           .then((result) => {
           // console.log(result.data)
            this.allPricePlans = result.data.price_plans
            this.viewPlans = !this.viewPlans
           })
        },

        addNewPlan(){
            if(this.newPlanName && this.newCallCost && this.newSmsCost) {
                return axios.post(`/api/price_plan/create`, {
                "name" : this.newPlanName,
                "call_cost" : this.newCallCost,
                "sms_cost" : this.newSmsCost
                }).then((result) =>{
                this.newMessage = result.data.message
                setTimeout(() => {
                    this.newPlanName = ''
                    this.newCallCost = 0
                    this.newSmsCost = 0
                    this.newMessage = ''
                  }, 3000)
            })
            } else {
                this.newPlanFail = "New price plan information required!"
                setTimeout(() => {
                    this.newPlanFail = ""
                  }, 3000)
            }
            
        },
        updatePlan(){
            if(this.updatename && this.updateCallCost && this.updateSmsCost) {
                return axios.post(`/api/price_plan/update`, {
                "name" : this.updatename,
                "call_cost" : this.updateCallCost,
                "sms_cost" : this.updateSmsCost
            }).then((result) => {
                this.updateMessage = result.data.message
                setTimeout(() => {
                    this.updatename = ''
                    this.updateCallCost = 0
                    this.updateSmsCost = 0
                    this.updateMessage = ''
                  }, 3000)
            })
            } else {
                this.updateFail = "Update information required!"
                setTimeout(() => {
                   this.updateFail = ''
                  }, 3000)
            }
            
        },
    
        deletePlan(){
            if(this.planId){
            return axios.post(`/api/price_plan/delete`, {
                "id" : this.planId
            }).then((result) => {
                this.deleteMessage = result.data.message
                setTimeout(() => {
                    this.planId = 0
                    this.deleteMessage = ''
                  }, 3000)
            }) 
            } else {
                this.deleteFail = "Plan Id required!"
                setTimeout(() => {
                    this.deleteFail = ""
                  }, 3000)
            }
            
        },

        viewTable (){
            this.showHistory = false
        },
        getBillHistory (){
            return axios.get(`/api/history`)
            .then((result) => { 
                this.billHistory = result.data.billHistory
                console.log(this.billHistory)
                this.showHistory = true
            })
        },
        clearHistory (){
            if (this.billHistory.length > 0) {
                 return axios.post('/api/delete/history', {})
                .then((result) => {
                this.deleteHistoryMessage = result.data.status
                this.getBillHistory ()
                setTimeout(() => {
                    this.deleteHistoryMessage = ''
                  }, 3000)
            })
            } else {
                this.emptyTable = "Bill History clear!"
                setTimeout(() => {
                    this.emptyTable = ''
                  }, 3000)
            }
           
        },

        init(){
            this.getAllPricePlans()
            
        }
      }
    })
})