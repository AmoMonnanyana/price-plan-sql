document.addEventListener('alpine:init', () => {
    Alpine.data('phoneBill', function() {
      return {
        totalPhoneBill: '',
        price_plan: '',
        actions: '',
        submittedList: '',
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
        viewPlans: false,
        listOfBills: [],
        showHistory: false,
        showTotal: false,

        calculateBill(){
           return axios.post(`/api/phonebill`, {
                "price_plan" : this.price_plan,
                "actions" : this.actions
            }).then((result) => {
                this.totalPhoneBill = result.data.total
                localStorage['actions'] = this.actions
                this.showTotal = true
                setTimeout(() => {
                    this.price_plan = ''
                    this.actions = ''
                    this.totalPhoneBill = ''
                    this.showTotal = false
                  }, 3000)
            })
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
        },
        updatePlan(){
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
        },
    
        deletePlan(){
            return axios.post(`/api/price_plan/delete`, {
                "id" : this.planId
            }).then((result) => {
                this.deleteMessage = result.data.message
                setTimeout(() => {
                    this.planId = 0
                    this.deleteMessage = ''
                  }, 3000)
            })
        },

        getBillHistory (){
            return axios.get(`/api/history`)
            .then((result) => {
                this.billHistory = result.data.allTotals
                this.thePlans =  Object.keys(this.billHistory)
                this.listOfBills = result.data.listOfBills
                console.log(this.billHistory)
                console.log(this.listOfBills)
                this.showHistory = !this.showHistory
            })
        }
      }
    })
})