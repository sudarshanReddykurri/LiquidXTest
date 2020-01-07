const epochToJsDate=(unixtimestamp)=>{
    // Months array
    let months_arr = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];

    // Convert timestamp to milliseconds
    let date = new Date(unixtimestamp * 1000);

    // Year
    let year = date.getFullYear();

    // Month
    let month = months_arr[date.getMonth()];

    // Day
    let day = date.getDate();

    // Hours
    // let hours = date.getHours(); // 24hrs Format
    let hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours(); // 12hrs Format

    // Minutes
    let minutes = "0" + date.getMinutes();

    // Seconds
    let seconds = "0" + date.getSeconds();

    // AM or PM
    let am_pm = date.getHours() >= 12 ? "PM" : "AM";

    // Display date time in MM-dd-yyyy h:m:s format
    let convdataTime =
      day +
      "-" +
      month +
      "-" +
      year +
      " " +
      hours +
      ":" +
      minutes.substr(-2) +
      " " +
      am_pm;

    // +
    // ":" +
    // seconds.substr(-2);

    return convdataTime;
  }

  export { epochToJsDate }