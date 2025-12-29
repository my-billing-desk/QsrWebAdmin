import axios from 'axios';

async function test() {
    try {
        console.log('Logging in...');
        const res = await axios.post('http://localhost:5001/api/auth/login', {
            username: 'admin',
            password: 'admin123'
        });

        console.log('Login Response User:', JSON.stringify(res.data.user, null, 2));
        const token = res.data.token;

        console.log('Fetching Profile...');
        const res2 = await axios.get('http://localhost:5001/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Profile Response User:', JSON.stringify(res2.data.user, null, 2));

    } catch (e) {
        console.error('Error:', e.response?.data || e.message);
    }
}

test();
