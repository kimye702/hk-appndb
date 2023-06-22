const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 3000;

// MySQL 연결 설정
const connection = mysql.createConnection({
  host: '{MySQL_server_name}.mysql.database.azure.com',
  user: '{user_name}@{MySQL_server_name}',
  password: '{password}',
  database: '{database_name}',
  ssl: {
    ca: Buffer.from('{SSL_CERTIFICATE_BUNDLE_CONTENT}', 'base64').toString(),
  },
});

// MySQL 연결
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// 요청 본문 해석을 위한 미들웨어 설정
app.use(bodyParser.json());

// 데이터 저장 엔드포인트
app.post('/saveData', (req, res) => {
  const name = req.body.name;

  // 데이터베이스에 데이터 저장
  const query = `INSERT INTO your_table_name (name) VALUES ('${name}')`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error saving data:', err);
      res.status(500).json({ error: 'Error saving data' });
      return;
    }
    console.log('Data saved:', results);
    res.status(200).json({ message: 'Data saved successfully' });
  });
});

// 데이터 불러오기 엔드포인트
app.get('/', (req, res) => {
  // 데이터베이스에서 데이터 불러오기
  const query = 'SELECT name FROM your_table_name';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error loading data:', err);
      res.status(500).json({ error: 'Error loading data' });
      return;
    }
    if (results.length === 0) {
      console.log('No data found');
      res.status(404).json({ error: 'No data found' });
      return;
    }
    const name = results[0].name;
    console.log('Data loaded:', name);
    res.status(200).json({ name: name });
  });
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
