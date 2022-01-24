exports.getDate = ()=>{
  var today = new Date();
  var options = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }
  return today.toLocaleDateString("en-US", options);
}


exports.getDay = ()=>{
  var today = new Date();
  var options = {
    weekday: "long"
  }
  return today.toLocaleDateString("en-US", options);
}
