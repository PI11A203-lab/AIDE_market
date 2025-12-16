const mysql = require('mysql2/promise');

async function copyDatabase() {
  console.log('Connecting to databases...');
  
  const source = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'aide_market',
    charset: 'utf8mb4'
  });

  const target = await mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'root',
    database: 'aide_market',
    charset: 'utf8mb4'
  });

  // 외래 키 체크 끄기
  await target.query('SET FOREIGN_KEY_CHECKS = 0');

  const [tables] = await source.query('SHOW TABLES');
  console.log(`Found ${tables.length} tables`);
  
  for (const table of tables) {
    const tableName = Object.values(table)[0];
    console.log(`\nCopying ${tableName}...`);
    
    try {
      // CREATE TABLE
      const [createTable] = await source.query(`SHOW CREATE TABLE \`${tableName}\``);
      await target.query(`DROP TABLE IF EXISTS \`${tableName}\``);
      await target.query(createTable[0]['Create Table']);
      
      // Copy data
      const [rows] = await source.query(`SELECT * FROM \`${tableName}\``);
      
      if (rows.length > 0) {
        const columns = Object.keys(rows[0]);
        
        // Batch insert (100 rows at a time)
        for (let i = 0; i < rows.length; i += 100) {
          const batch = rows.slice(i, i + 100);
          const values = batch.map(row => 
            `(${columns.map(col => target.escape(row[col])).join(',')})`
          ).join(',');
          
          await target.query(
            `INSERT INTO \`${tableName}\` (\`${columns.join('`,`')}\`) VALUES ${values}`
          );
        }
      }
      
      console.log(`✓ ${tableName}: ${rows.length} rows copied`);
    } catch (err) {
      console.error(`✗ ${tableName}: ${err.message}`);
    }
  }

  // 외래 키 체크 다시 켜기
  await target.query('SET FOREIGN_KEY_CHECKS = 1');

  await source.end();
  await target.end();
  console.log('\n✓ All done!');
}

copyDatabase().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});