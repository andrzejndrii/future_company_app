var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var myObj, i, x="";
    myObj = JSON.parse(this.responseText);
    // console.log(myObj);
    for (i in myObj){
        x+=myObj[i].name+"<br>"

        // console.log(x);
    }
    document.getElementById("authors").innerHTML =  x;

    // document.getElementById("authors").innerHTML = myArr[];
  }
};
xmlhttp.open("GET", "https://recruitment.hal.skygate.io/companies", true);
xmlhttp.send();