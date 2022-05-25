let date = "2/10/1977";
date = new Date(
    `${date.split("/")[2]}-${date.split("/")[0]}-${date.split("/")[1]}`
);
console.log(date);
const newUser = {
    dob: new Date(date)
};

var dob = "09/11/2022"
console.log(dob.split("/"));
console.log(dob.split("/")[0]);
console.log(dob.split("/")[1]);
console.log(dob.split("/")[2]);