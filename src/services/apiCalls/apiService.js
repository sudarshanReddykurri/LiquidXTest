// https://shuheikagawa.com/blog/2017/05/13/http-request-timeouts-in-javascript/
// https://stackoverflow.com/questions/52092873/how-do-i-make-axios-api-call-in-a-separate-component-file
// https://danlevy.net/you-may-not-need-axios/
// https://www.codementor.io/@capocaccia/keeping-axios-where-it-belongs-o6xidrkrk

import axios from "axios";

//here is where we are defining our custom axios instance.
//if all of your API routes come from the same location, or you are using a web proxy to hit the server, you can provide a base url
//you can also attach axios interceptors to custom axios instances as well
const apiClient = axios.create({
  baseURL: "https://prspmobapi.perspect.ai/v3-dev"
});

// let axiosConfig = {
//   headers: {
//     "Content-Type": "application/json;charset=UTF-8",
//     "Access-Control-Allow-Origin": "*"
//     //'Authorization': 'token'
//   }
// };

//Now set up the routes.  We are going to export a default object with keys that keep our API routes organized.  For example, all of the auth routes live in the Auth object

const apiCall = {
  userExists(emailID) {
    return apiClient.get("/users/exists/" + emailID, {
      headers: this.getHeaders()
    });
  },
  userLogin(payload) {
    return apiClient.put("/login/", payload, {
      headers: this.getHeaders()
    });
  },
  forgotPassword(payload) {
    // { email_id: values.email.toLowerCase().trim() }
    return apiClient.put("/login/forgot_passwd/", payload, {
      headers: this.getHeaders()
    });
  },
  verifyOTP(emailID, OTP) {
    return apiClient.get("/login/psotpverify/" + emailID + "/" + OTP, {
      headers: this.getHeaders()
    });
  },
  afterOTPUpdateResetPassword(payload) {
    console.log("TCL: afterOTPUpdateResetPassword -> payload", payload)
    // { email_id: email_id, otp: otp, passwd: values.confirmpassword };
    return apiClient.put("/login/passwd/", payload, {
      headers: this.getHeaders()
    });
  },
  licenceVerify(payload) {
    console.log("TCL: licenceVerify -> payload", payload)
    // { email_id: User_EmailID, key: values.licensekey };
    return apiClient.put("/users/licence/", payload, {
      headers: this.getHeaders()
    });
  },
  userSignUp(payload) {
    // { firstName: first_name,lastName: last_name,email_id: email_id,gender: gender,mobile: mobile_number,passwd: values.confirmpassword,dob: date_of_birth,Version: "2.01.01",key: license_key}
    return apiClient.post("/users/profile/", payload, {
      headers: this.getHeaders()
    });
  },

  userFaceRegister(payload) {
    // ['{"playerid":"' +UserID +'", "image_number":' +capturecounter +', "encoded_image": "' +data["base64"].toString() +'"}']
    return apiClient.post("/images/register", payload, {
      headers: this.getHeaders()
    });
  },

  getUserAssessments(userId) {
    return apiClient.get("/user/assessments/" + userId, {
      headers: this.getHeaders()
    });
  },

  sendGameDataToCloud(payload) {
    // { name: "raw_data", data: unity_json_parser["data"]}
    return apiClient.post("/post/", payload, {
      headers: this.getHeaders()
    });
  },

  submitAssessment(payload) {
    // { user_id: Store.userId, assessmt_id: Store.AssessmentId };
    return apiClient.post("/user/assessments/", payload, {
      headers: this.getHeaders()
    });
  },

  getAssessmentModules(userID, assessmentID) {
    return apiClient.get("/users/validity/" + userID + "/" + assessmentID, {
      headers: this.getHeaders()
    });
  },

  gameDataUpload(payload){
    console.log("TCL: gameDataUpload -> payload", payload)
    // { name: res[sync_game_current_index]["game_name"], data: res[sync_game_current_index]["unity_data"] }
    return apiClient.post("/game/", payload, {
      headers: this.getHeaders()
    });
  },

  imageDataUpload(payload) {
    console.log("TCL: imageDataUpload -> payload", payload)
    // {  playerid: player_id, game_name: res[sync_image_current_index]["game_name"], timestamp: res[sync_image_current_index]["timestamp"],encoded_image: res[sync_image_current_index]["unity_data"] }
    return apiClient.post("/images/", payload, {
      headers: this.getHeaders()
    });
  },

  imageUploadCompleted(payload) {
    // { user_id: Store.userId };
    return apiClient.post("/images/complete/", payload, {
      headers: this.getHeaders()
    });
  },

  userLogout(payload) {
    // { user_id: Store.userId, device_id: deviceData.DeviceID }
    return apiClient.post("/logout/", payload, {
      headers: this.getHeaders()
    });
  },

  userAliveAndActive(payload) {
    return apiClient.post("/auth/check/", payload, {
      headers: this.getHeaders()
    });
  },
  generateResetToken(payload) {
    return apiClient.post("/auth/generate_reset_token/", payload, {
      headers: this.getHeaders()
    });
  },
  getHeaders() {
    return {
      //"Accept": "application/json",
      "Content-Type": "application/json"
      // "Access-Control-Allow-Origin": "*",
      // "Access-Control-Allow-Headers": "Content-Type"
      //   'uid': Auth.uid,
      //   'client': Auth.client,
      //   'access-token': Auth.access_token
    };
  }
};

export default apiCall;
