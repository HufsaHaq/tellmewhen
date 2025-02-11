import QRCode from 'qrcode'
import {createjob, executeQuery} from './db.js';
// import { insert_job } from './db.js'


/**
 * Retrieves the random job ID from the DB for a given jobId.
 * @param job_id
 * @returns {Promise<unknown>}
 */
async function job_id_to_random_job_id(job_id) {
  const sql = `
    SELECT Random_Job_ID
    FROM JOB_TABLE
    WHERE Job_ID = ?
  `;

  // This returns an array of row objects
  const rows = await executeQuery(sql, [job_id]);

  // rows[0] is { Random_Job_ID: 'da3ba4b6933e7a0cd9c1' }
  // so rows[0].Random_Job_ID is the string value you want.
  if (rows.length === 0) {
    // Handle the case where no matching job is found
    throw new Error('No job found for Job_ID ' + job_id);
  }

  return rows[0].Random_Job_ID;
}
/**
 * Retrieves the job ID from the DB for a given random jobId.
 * @param random_job_id
 * @returns {Promise<unknown>}
 */
async function random_job_id_to_job_id(random_job_id){
     const sql = `
    SELECT Job_ID
    FROM JOB_TABLE
    WHERE Random_Job_ID = ?
  `;
     const job_id = await executeQuery(sql, [random_job_id])
    return job_id
}

export function generate_url(id) {
  return `https://tellmewhen.co.uk/${id}`;
}

/**
 * takes job_id, generates fetches random id from db and generates url and qr-code directing to this url and represents in base 64
 * @param url
 * @returns {Promise<string>}
 */
export async function generate_qr(job_id) {
    const rand = await job_id_to_random_job_id(job_id);
    const url = generate_url(rand);
    return QRCode.toDataURL(url, {
    color: {
      dark: '#00F',
      light: '#0000'
    }
  });
}





/*
async function test_insert_job(){
    const job_id = await insert_job(  'Fix server issues', 'https://techcorp.com/job/1', '2025-03-01 12:00:00');
    const sql = `SELECT  FROM JOB_TABLE WHERE Job_ID = ?`;

    const res = await executeQuery(sql, [job_id]);
    console.log(res)
    return await res;
}
*/

/*
async function test_job_id_to_randon_job(){
      const jobid = await insert_job(  'Fix server issues', 'https://techcorp.com/job/1', '2025-03-01 12:00:00');
      const rand = await job_id_to_random_job_id(jobid)
      console.log(rand)

}

//await test_job_id_to_randon_job();
*/


/*
async function test_generate_url() {
  const jobid = await insert_job('Fix server issues', 'https://techcorp.com/job/1', '2025-03-01 12:00:00');

  const randomId = await job_id_to_random_job_id(jobid);

  const url = await generate_url(randomId);
  console.log(url);
  return url;
}

await test_generate_url();
*/

/*
async function test_qr() {
  // 1. Insert => get normal job ID
  const jobid = await insert_job('Fix server issues', 'https://techcorp.com/job/1', '2025-03-01 12:00:00');


  // 4. Convert URL -> QR code
  const qr = await generate_qr(jobid);
  console.log(qr);
}

await test_qr();
//await test_insert_job();
await createjob();


*/
