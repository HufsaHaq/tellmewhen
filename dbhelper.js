import sqlite3 from "sqlite3";


//https://www.sqlitetutorial.net/sqlite-nodejs/update/ GREAT ONE FOR TEMPLATE

// Open database connection
const db = new sqlite3.Database('tellmewhen.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Execute helper for running SQL queries
export const execute = async (db, sql, params = []) => {
    return new Promise((resolve, reject) => {
        if (params && params.length > 0) {
            db.run(sql, params, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, changes: this.changes });
                }
            });
        } else {
            db.exec(sql, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        }
    });
};

// Fetch helper to retrieve all rows
export const fetchAll = (db, sql, params = []) => {
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

// Fetch helper to retrieve a single row
export const fetchOne = (db, sql, params = []) => {
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

// Insert helper
export const insertRecord = async (db, table, data) => {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const placeholders = keys.map(() => '?').join(', ');

    const sql = `
        INSERT INTO ${table} (${keys.join(', ')})
        VALUES (${placeholders});
    `;

    return execute(db, sql, values);
};

// Update helper
export const updateRecord = async (db, table, data, idColumn) => {
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

    return execute(db, sql, params);
};

// Main function
const main = async () => {
    const db = new sqlite3.Database("tellmewhen.db", (err) => {
        if (err) {
            console.error("Error connecting to database:", err.message);
        } else {
            console.log("Connected to SQLite database.");
        }
    });

    try {
        // Create table if it doesn't exist
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS USER_TABLE (
                User_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                Username TEXT NOT NULL,
                Hashed_Password TEXT NOT NULL,
                Business_ID INTEGER
            );
        `;
        await execute(db, createTableSQL);

        // Insert a new user
        const newUser = {
            Username: "JohnDoe",
            Hashed_Password: "securepassword",
            Business_ID: 1,
        };

        // Fetch the user to check if they exist
        const existingUser = await fetchOne(db, `SELECT * FROM USER_TABLE WHERE Username = ?`, [newUser.Username]);

        if (existingUser) {
            console.log("User exists. Updating the record...");
            const updatedUser = {
                ...newUser,
                User_ID: existingUser.User_ID, // Include the ID for the update
            };
            await updateRecord(db, "USER_TABLE", updatedUser, "User_ID");
            console.log("User updated successfully.");
        } else {
            console.log("User does not exist. Inserting a new record...");
            await insertRecord(db, "USER_TABLE", newUser);
            console.log("New user inserted successfully.");
        }

        // Fetch all users to verify
        const fetchUsersSQL = `SELECT * FROM USER_TABLE`;
        const users = await fetchAll(db, fetchUsersSQL);
        console.log("All users:", users);
    } catch (err) {
        console.error("Database error:", err.message);
    } finally {
        db.close((err) => {
            if (err) {
                console.error("Error closing database:", err.message);
            } else {
                console.log("Database connection closed.");
            }
        });
    }
};

main();
