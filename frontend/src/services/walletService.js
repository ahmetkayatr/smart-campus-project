import api from './api';

const getBalance = () => api.get('/wallet/balance');
const topUp = (amount) => api.post('/wallet/topup', { amount });

export default { getBalance, topUp };