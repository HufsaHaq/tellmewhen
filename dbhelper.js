import sqlite3 from 'sqlite3';

// Open database connection
const db = new sqlite3.Database('tellmewhen.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// run a single query
const runQuery = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID, changes: this.changes });
            }
        });
    });
};

// fetch all rows (show all)
const fetchAll = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// get a single row
const fetchOne = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

// isert record
const insertRecord = async (table, data) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    return runQuery(sql, values);
};

// Update a record
const updateRecord = async (table, data, whereClause, whereParams) => {
    const updates = Object.keys(data).map((key) => `${key} = ?`).join(', ');
    const values = [...Object.values(data), ...whereParams];
    const sql = `UPDATE ${table} SET ${updates} WHERE ${whereClause}`;
    return runQuery(sql, values);
};

// Delete a record
const deleteRecord = async (table, whereClause, whereParams) => {
    const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
    return runQuery(sql, whereParams);
};

// Utility: Check if a table exists
const checkTableExists = async (tableName) => {
    const sql = `
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name=?
    `;
    const result = await fetchOne(sql, [tableName]);
    return !!result;
};

// close connections
const closeDatabase = () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
};
//#------------------------------Functions end----------------------------------#
(async () => {
    try {
        const tableExists = await checkTableExists('USER_TABLE');
        console.log('USER_TABLE exists:', tableExists);

        // Insert a new record
        const newUser = { Username: 'JohnDoe', Hashed_Password: 'password123', Business_ID: null };
        const insertResult = await insertRecord('USER_TABLE', newUser);
        console.log('Inserted record ID:', insertResult.id);

        // Update the record
        const updateResult = await updateRecord(
            'USER_TABLE',
            { Hashed_Password: 'newpassword123' },
            'User_ID = ?',
            [insertResult.id]
        );
        console.log('Number of rows updated:', updateResult.changes);

        // Fetch all users
        const users = await fetchAll('SELECT * FROM USER_TABLE');
        console.log('All users:', users);

        // Delete the user
        const deleteResult = await deleteRecord('USER_TABLE', 'User_ID = ?', [insertResult.id]);
        console.log('Number of rows deleted:', deleteResult.changes);
    } catch (error) {
        console.error('Database error:', error.message);
    } finally {
        closeDatabase();
    }
})();
