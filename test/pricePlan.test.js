import assert from 'assert';
import supertest from 'supertest';
import { app } from '../express.js';

const request = supertest(app);

describe('Price Plan API', function() {
    describe('Function to get all price plans: ', function() {
        it('should get all price plans', async function() {
            const res = await request.get('/api/khanyie/price_plans/');
            assert.strictEqual(res.status, 200);
            assert.ok(Array.isArray(res.body));
        });
    });

    describe('Function to create a new price plan: ', function() {
        it('should create a new price plan', async function() {
            const res = await request.post('/api/khanyie/price_plan/create/')
                .send({ name: 'Planss Aa', call_cost: 2.5, sms_cost: 0.5 });
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body.message, 'Price plan created successfully');
        });

        it('should not create a duplicate price plan', async function() {
            const res = await request.post('/api/khanyie/price_plan/create/')
                .send({ name: 'Plan A', call_cost: 2.5, sms_cost: 0.5 });
            assert.strictEqual(res.status, 400);
            assert.strictEqual(res.body.message, 'Price plan name already exists');
        });
    });

    describe('Function to update the price plan: ', function() {
        it('should update an existing price plan', async function() {
            const res = await request.post('/api/khanyie/price_plan/update/')
                .send({ id: 1, name: 'Updated Plan', call_cost: 3.0, sms_cost: 0.6 });
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body.message, 'Price plan updated successfully');
        });
    });

    describe('Function to calculate the price plan bills: ', function() {
        it('should calculate the total phone bill for a price plan', async function() {
            const res = await request.post('/api/khanyie/price_plan/calculatePhoneBill/')
                .send({ price_plan: 'Plan A', actions: 'sms,call,sms' });
            assert.strictEqual(res.status, 200);
            assert.ok(res.body.total.startsWith('R'));
        });

        it('should return error if price plan name is not found', async function() {
            const res = await request.post('/api/khanyie/price_plan/calculatePhoneBill/')
                .send({ price_plan: 'Nonexistent Plan', actions: 'sms,call' });
            assert.strictEqual(res.status, 404);
            assert.strictEqual(res.body.error, 'Price plan name not found');
        });
    });

    describe('Function to delete the price plan: ', function() {
        it('should delete an existing price plan', async function() {
            const res = await request.post('/api/khanyie/price_plan/delete/')
                .send({ id: 26 });
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body.message, 'Price plan deleted successfully');
        });


        it('should return 404 if the price plan does not exist', async function() {
            const res = await request.post('/api/khanyie/price_plan/delete/')
                .send({ id: 9999 });
            assert.strictEqual(res.status, 404);
            assert.strictEqual(res.body, 'Record not found to be deleted');
        });

        it('should return 420 if the function fails to execute', async function() {
            const res = await request.post('/api/khanyie/price_plan/delete/')
                .send({ id: null });
            assert.strictEqual(res.status, 420);
            assert.strictEqual(res.body, 'Function failed to be executed!');
        });
    });
});
