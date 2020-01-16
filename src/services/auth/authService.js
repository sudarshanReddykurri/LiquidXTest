// https://hptechblogs.com/using-json-web-token-react/
import decode from "jwt-decode";
import jumpTo, { goTo } from "../navigation";

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

  setToken(idToken) {
    console.log("TCL: setToken -> idToken", idToken);
    // Saves user token to localStorage
    localStorage.setItem("id_token", idToken);
  },

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem("id_token");
  },

  logout() {
    // Clear user token and profile data from localStorage
    return new Promise((resolve, reject) => {
      localStorage.removeItem("userStore");
      localStorage.removeItem("id_token");
      localStorage.removeItem("reset_game");
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
