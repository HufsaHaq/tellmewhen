import mysql from 'mysql2/promise';

// Create a database connection
const connectToDatabase = async () => {
    try {
        const connection = await mysql.createConnection({
            host: 'dbhost.cs.man.ac.uk', 
            user: 'z26101hh', 
            password: 'UTZxLV/au62nauNC7XxBhNsvh5Wm7CcShrtKz4bwj24',
            database: 'tellmewhen' 
        });
        console.log('Connected to MySQL database.');
        return connection;
    } catch (err) {
        console.error('Error connecting to database:', err.message);
        throw err;
    }
};

// Execute helper for running SQL queries
export const execute = async (connection, sql, params = []) => {
    try {
        const [result] = await connection.execute(sql, params);
        return result;
    } catch (err) {
        console.error('Error executing query:', err.message);
        throw err;
    }
};

// Fetch helper to retrieve all rows
export const fetchAll = async (connection, sql, params = []) => {
    try {
        const [rows] = await connection.execute(sql, params);
        return rows;
    } catch (err) {
        console.error('Error fetching data:', err.message);
        throw err;
    }
};

// Fetch helper to retrieve a single row
export const fetchOne = async (connection, sql, params = []) => {
    try {
        const [rows] = await connection.execute(sql, params);
        return rows[0] || null;
    } catch (err) {
        console.error('Error fetching single row:', err.message);
        throw err;
    }
};

// Insert helper
export const insertRecord = async (connection, table, data) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');

    const sql = `
        INSERT INTO ${table} (${keys.join(', ')})
        VALUES (${placeholders});
    `;

    return execute(connection, sql, values);
};

// Update helper
export const updateRecord = async (connection, table, data, idColumn) => {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const updates = keys.map(key => `${key} = ?`).join(', ');

    const sql = `
        UPDATE ${table}
        SET ${updates}
        WHERE ${idColumn} = ?;
    `;

    // Append the ID column value to the end of the parameters
    const params = [...values, data[idColumn]];

    return execute(connection, sql, params);
};

// Main function
const main = async () => {
    let connection;
    try {
        connection = await connectToDatabase();

        // Create table if it doesn't exist
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS USER_TABLE (
                User_ID INT AUTO_INCREMENT PRIMARY KEY,
                Username VARCHAR(255) NOT NULL,
                Hashed_Password VARCHAR(255) NOT NULL,
                Business_ID INT
            );
        `;
        await execute(connection, createTableSQL);

        // Insert a new user
        const newUser = {
            Username: 'JohnDoe',
            Hashed_Password: 'securepassword',
            Business_ID: 1,
        };

        // Fetch the user to check if they exist
        const existingUser = await fetchOne(connection, `SELECT * FROM USER_TABLE WHERE Username = ?`, [newUser.Username]);

        if (existingUser) {
            console.log('User exists. Updating the record...');
            const updatedUser = {
                ...newUser,
                User_ID: existingUser.User_ID, // Include the ID for the update
            };
            await updateRecord(connection, 'USER_TABLE', updatedUser, 'User_ID');
            console.log('User updated successfully.');
        } else {
            console.log('User does not exist. Inserting a new record...');
            await insertRecord(connection, 'USER_TABLE', newUser);
            console.log('New user inserted successfully.');
        }

        // Fetch all users to verify
        const fetchUsersSQL = `SELECT * FROM USER_TABLE`;
        const users = await fetchAll(connection, fetchUsersSQL);
        console.log('All users:', users);
    } catch (err) {
        console.error('Database error:', err.message);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed.');
        }
    }
};

main();
