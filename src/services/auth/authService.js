// https://hptechblogs.com/using-json-web-token-react/
import decode from "jwt-decode";
import jumpTo, { goTo } from "../navigation";
import Cookies from "js-cookie";

const authService = {
  isLoggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken(); // Getting token from localstorage
    return !!token && !this.isTokenExpired(token); // handwaiving here
  },

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        // Checking if token is expired. N
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  },

  isAppVersionChanged(versionNumber) {
    try {
      if (this.getAppVersion() && this.getAppVersion() != versionNumber) {
        // Checking App Version Changes or not
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  },

  setToken(idToken) {
    console.log("TCL: setToken -> idToken", idToken);
    // Saves user token to localStorage
    // localStorage.setItem("id_token", idToken);
    Cookies.set("id_token", idToken, { expires: 7 });
  },

  getToken() {
    // Retrieves the user token from localStorage
    // return localStorage.getItem("id_token");
    return Cookies.get("id_token");
  },

  setAppVersion(versionNumber) {
    console.log("TCL: setAppVersion -> versionNumber", versionNumber);
    Cookies.set("app_version", versionNumber, { expires: 7 });
  },

  getAppVersion() {
    return Cookies.get("app_version") ? Cookies.get("app_version") : null;
  },

  clearCookies() {
    try {
      Cookies.remove("app_version");
      Cookies.remove("id_token");
      Cookies.remove("userStore");
    } catch (error) {
      console.log("TCL: clearCookies -> error", error);
    }
  },

  logout() {
    // Clear user token and profile data from localStorage
    return new Promise((resolve, reject) => {
      Cookies.remove("id_token");
      Cookies.remove("userStore");
      //localStorage.removeItem("userStore");
      //localStorage.removeItem("id_token");
      //localStorage.removeItem("reset_game");
      resolve(true);
    })
      .catch(error => {
        console.log(error);
      })
      .catch(error => {
        console.log("from completedTable" + error);
      });

    //goTo("/login");
  },

  getProfile() {
    // Using jwt-decode npm package to decode the token
    return decode(this.getToken());
  }

  // fetch(url, options) {
  //     // performs api calls sending the required authentication headers
  //     const headers = {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json'
  //     }

  //     // Setting Authorization header
  //     // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
  //     if (this.loggedIn()) {
  //         headers['Authorization'] = 'Bearer ' + this.getToken()
  //     }

  //     return fetch(url, {
  //         headers,
  //         ...options
  //     })
  //         .then(this._checkStatus)
  //         .then(response => response.json())
  // }
};

export default authService;
