document.addEventListener('alpine:init', () => {
    Alpine.data("PricePlanSQL", () => {
        return {
            newPlan: { name: '', call_cost: '', sms_cost: '' },
            updatePlan: { id: '', name: '', call_cost: '', sms_cost: '' },
            calcData: { price_plan: '', actions: '' },
            deletePlan: { id: '' },
            pricePlans: [],
            calculatedTotal: '',
            showPlans: false,
    
            async fetchPricePlans() {
                try {
                    const response = await axios.get('http://localhost:3013/api/khanyie/price_plans/');
                    this.pricePlans = response.data;
                    this.showPlans = true;
                    setTimeout(() => {this.pricePlans = [] }, 90000)
                } catch (error) {
                    console.error('Error fetching price plans:', error);
                }
            },

            togglePricePlans() {
                if (this.showPlans) {
                    this.pricePlans = [];
                    this.showPlans = false;
                } else {
                    this.fetchPricePlans();
                }
            },
    
            async createPricePlan() {
                try {
                    await axios.post('http://localhost:3013/api/khanyie/price_plan/create/', this.newPlan);
                    alert('Price plan created successfully');
                    this.fetchPricePlans();
                } catch (error) {
                    console.error('Error creating price plan:', error);
                    alert("Price plan name already exists");
                }
            },
    
            async updatePricePlan() {
                try {
                    await axios.post('http://localhost:3013/api/khanyie/price_plan/update/', this.updatePlan);
                    alert('Price plan updated successfully');
                    this.fetchPricePlans();
                } catch (error) {
                    console.error('Error updating price plan:', error);
                }
            },
    
            async calculatePhoneBill() {
                try {
                    const response = await axios.post('http://localhost:3013/api/khanyie/price_plan/calculatePhoneBill/', this.calcData);
                    this.calculatedTotal = response.data.total;
                    setTimeout(() => {
                        this.calculatedTotal = '';
                    }, 5000)
                } catch (error) {
                    console.error('Error calculating phone bill:', error);
                    alert("Invalid plan name, sorry.")
                }
            },
    
            async deletePricePlan() {
                try {
                    await axios.post('http://localhost:3013/api/khanyie/price_plan/delete/', this.deletePlan);
                    alert('Price plan deleted successfully');
                    this.fetchPricePlans();
                } catch (error) {
                    console.error('Error deleting price plan:', error);
                }
            }
        };
    })
});