import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  // This is the crucial addition to fix the insecure transport error:
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  },
  connectionLimit: 1, 
  maxIdle: 1,
  enableKeepAlive: true,
});

export default pool;