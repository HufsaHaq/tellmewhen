import axios from "axios";
import { RefreshAccessToken } from "./session_management";
async function GetCode(jobID) {
    /*
    Gets a QR code for the user to add a job
    Parameters:
        jobID: string
    Returns:
        string: Base64 encoded image
    
    */
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAOMSURBVO3BQa7cVgADweaD7n/ljhdZcCVA0Mx37LAq/sLMvw4z5TBTDjPlMFMOM+UwUw4z5TBTDjPlMFMOM+UwUw4z5TBTDjPl4qUk/CSVloSm0pLQVFoS7qi0JNxRaUn4SSpvHGbKYaYcZsrFh6l8UhLuqLyh8oTKGyqflIRPOsyUw0w5zJSLL0vCEypPJKGp3EnCGyotCU3liSQ8ofJNh5lymCmHmXLxh1N5QuWNJPzNDjPlMFMOM+Xify4Jd1SaSkvC3+QwUw4z5TBTLr5M5ZuS0FSeUHlD5Q2V/5LDTDnMlMNMufiwJPxJktBUWhKaSktCU7mThP+yw0w5zJTDTLl4SeV3Urmj0pLQVL5J5U9ymCmHmXKYKRcvJaGptCQ0lSeScEflThI+KQlN5YkkNJU7SWgqLQlN5Y3DTDnMlMNMufiwJDSVJ5LQVJ5IQlN5IglNpSWhJaGptCQ8kYSm0pLwTYeZcpgph5ly8ZJKS0JLQlN5IglN5YkkNJWWhDdUWhLuqDyRhKbSkvBJh5lymCmHmXLxmyXhjsoTKi0JT6h8UxKeULmj8kmHmXKYKYeZcvFhKi0JbyShqbQkNJU3kvCGSkvCHZU3ktBU3jjMlMNMOcyUi99M5YkkfJPKnSS0JDSVb0rCNx1mymGmHGbKxUtJuKPSkvCGSkvCHZUnkvCESkvCE0l4QqUl4ZMOM+UwUw4zJf7CD0pCU3kiCU2lJaGptCTcUbmThCdUWhLuqPxOh5lymCmHmXLxUhK+KQlNpSWhqbQkNJU7Sbij0pJwJwmflISm8kmHmXKYKYeZcvGSyjep/E4qT6g8kYQ7SWgqLQlN5Y3DTDnMlMNMuXgpCT9J5U4SmkpLQlNpKp+UhKZyJwlN5ScdZsphphxmysWHqXxSEu6otCTcUbmThKbSkvCEyhMqd5LQVD7pMFMOM+UwUy6+LAlPqHxSEn5SEt5IQlO5k4Sm8sZhphxmymGmXPzlVO4koancUbmThKZyJwl3knBH5ZMOM+UwUw4z5eIPl4Sm0pLQVO4k4QmVT1K5k4SWhKbyxmGmHGbKYaZcfJnKN6m0JDSVloQ7Ki0JTaUl4U4SPknlmw4z5TBTDjPl4sOS8JOS0FRaEprKnSR8k8qdJDSVO0loKm8cZsphphxmSvyFmX8dZsphphxmymGmHGbKYaYcZsphphxmymGmHGbKYaYcZsphphxmyj9erIcnY1eO7gAAAABJRU5ErkJggg==";
    let base = localStorage["endpoint"];
    let attempt = await axios.get(base + "/url/" + jobID, {
    })
        .then((res) => {
            // if the token is invalid or expired
            if (res.statusCode === 401) {
                console.log(res.message);
                // checks to see if the refresh access token was valid
                if (RefreshAccessToken(accessToken) === true) {
                    // Recalls the function with the correct access token
                    return GetAllCurrentJobs(businessID, localStorage["accessToken"]);
                }
                else {
                    // If the access token passed is completely invalid, then we need to get a valid one
                    window.location.href = "/auth";
                    return null;
                }
            }
            // if the API call returned valid data
            else if (res.statusCode === 200) {
                return res;
            }
        });
}
