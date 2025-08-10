const pool = require("../database/");

async function logClassificationChange(name, action, user_id = null) {
  try {
    const sql = `
      INSERT INTO classification_history (classification_name, action, user_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await pool.query(sql, [name, action, user_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error logging classification change:", error);
    throw error;
  }
}


async function getClassificationHistory() {
  try {
    const sql = `
      SELECT ch.classification_name, 
             ch.action, 
             a.account_firstname, 
             a.account_lastname, 
             ch.change_date
      FROM classification_history ch
      LEFT JOIN account a 
        ON ch.user_id = a.account_id
      ORDER BY ch.change_date DESC
    `;
    const result = await pool.query(sql);
    return result.rows;
  } catch (error) {
    console.error("Error fetching classification history:", error);
    throw error;
  }
}




async function logVehicleAddition(inv_id, make, model, year, price, user_id = null) {
  try {
    const sql = `
      INSERT INTO vehicle_history (inv_id, make, model, year, price, added_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const result = await pool.query(sql, [inv_id, make, model, year, price, user_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error logging vehicle addition:", error);
    throw error;
  }
}


async function getVehicleHistory() {
  try {
    const sql = `
      SELECT vh.*, a.account_firstname, a.account_lastname
      FROM vehicle_history vh
      LEFT JOIN account a ON vh.added_by = a.account_id
      ORDER BY vh.change_date DESC;
    `;
    const result = await pool.query(sql);
    return result.rows;
  } catch (error) {
    console.error("Error fetching vehicle history:", error);
    throw error;
  }
}


module.exports = { logClassificationChange, getClassificationHistory, logVehicleAddition, getVehicleHistory };
