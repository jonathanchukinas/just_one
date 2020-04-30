// `tsc sandbox.ts` to compile file to sandbox.js
// `tsc sandbox.ts -w` to compile file to sandbox.js in realtime
/*
*******************************************************************************
From Typescript docs:
*******************************************************************************
*/
var Student = /** @class */ (function () {
    function Student(firstName, middleInitial, lastName) {
        this.firstName = firstName;
        this.middleInitial = middleInitial;
        this.lastName = lastName;
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
    ;
    return Student;
}());
;
;
function greeter(person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}
;
var user = new Student("Jane", "M.", "User");
;
var myUuid = '123';
var myGuid = '456';
var secondUuid = myGuid;
var myStr = 'abc';
function convertToUuid(value) {
    var newUuid = value;
    return newUuid;
}
console.log(convertToUuid(123));
;
var myEvent = { uuidRoom: '123' };
document.body.textContent = greeter(user);
