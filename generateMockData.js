// generateMockData.js
const mysql = require('mysql2');
require('dotenv').config();

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'myappdb',
  connectionLimit: 10
});

const promisePool = pool.promise();

// Define the mock records
const mockRecords = [
  ['John Doe', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'],
  ['Jane Smith', 'Curabitur vehicula nisl eu odio tincidunt, ut tincidunt purus consectetur.'],
  ['Alice Johnson', 'Integer facilisis neque vel ante vehicula, sed faucibus libero laoreet.'],
  ['Bob Brown', 'Pellentesque id libero ac felis malesuada vulputate ac a ligula.'],
  ['Charlie Davis', 'Sed tristique ligula nec nisl auctor, vel viverra est vehicula.'],
  ['Daisy Miller', 'Vestibulum ut ligula et turpis cursus sollicitudin a ac dui.'],
  ['Emily Wilson', 'Nullam auctor risus nec purus egestas, id varius libero auctor.'],
  ['Frank Taylor', 'Phasellus varius nisl et erat feugiat, at facilisis urna suscipit.'],
  ['Grace Lee', 'Fusce iaculis ligula at lectus aliquet, vitae tempor mi cursus.'],
  ['Henry Anderson', 'In efficitur urna ut mauris ultrices, vitae vulputate tortor fermentum.'],
  ['Isabella Thomas', 'Cras dictum eros sed ligula interdum, eu commodo ligula tincidunt.'],
  ['Jack White', 'Donec eu eros sit amet metus vulputate aliquam a a nulla.'],
  ['Kathy Brown', 'Mauris maximus felis non varius cursus, non facilisis turpis dignissim.'],
  ['Liam Harris', 'Aenean sagittis risus nec dui dapibus, non sodales velit accumsan.'],
  ['Mia Clark', 'Sed luctus sapien vel diam fermentum, nec sagittis nunc facilisis.']
];

// Insert mock data into the database
const insertMockData = async () => {
  try {
    await promisePool.getConnection();
    console.log('Connected to MySQL database');

    const query = 'INSERT INTO records (name, description) VALUES ?';
    await promisePool.query(query, [mockRecords]);
    console.log('Mock data inserted successfully');
  } catch (err) {
    console.error('Error inserting mock data:', err.message);
  } finally {
    await promisePool.end();
  }
};

insertMockData();
