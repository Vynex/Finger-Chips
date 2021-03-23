import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
	dotenv.config();
}

const PORT = process.env.PORT || 3000;
const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/finger-chips';


export { PORT, dbURL };
