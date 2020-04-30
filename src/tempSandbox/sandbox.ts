// `tsc sandbox.ts` to compile file to sandbox.js
// `tsc sandbox.ts -w` to compile file to sandbox.js in realtime


/*
*******************************************************************************
From Typescript docs:
*******************************************************************************
*/

class Student {
  fullName: string;
  constructor(public firstName: string, public middleInitial: string, public lastName: string) {
    this.fullName = firstName + " " + middleInitial + " " + lastName;
  };
};

interface Person {
  firstName: string;
  lastName: string;
};

function greeter(person: Person) {
  return "Hello, " + person.firstName + " " + person.lastName;
};

let user = new Student("Jane", "M.", "User");


/*
*******************************************************************************
Events
*******************************************************************************
*/

// https://spin.atomicobject.com/2018/01/15/typescript-flexible-nominal-typing/

// "Factory" for generating new flavors (i.e. custom types): 

interface Flavoring<FlavorT> {
  _type?: FlavorT;
};
type Flavor<T, FlavorT> = T & Flavoring<FlavorT>;
// type Flavor<T, FlavorT> = T & Flavoring<FlavorT>;

// type UniqueIdentifier = "uuid"
type UUID = Flavor<string, "UniqueIdentifier">;
type GUID = Flavor<string, "GloballyUniqueIdentifier">;

const myUuid: UUID = '123'
const myGuid: GUID = '456'
const secondUuid: UUID = myGuid


const myStr: string = 'abc'


function convertToUuid(value: UUID): UUID {
  const newUuid: UUID = value
  return newUuid;
}

console.log(convertToUuid(123))


interface gameEvent {
  uuidRoom: UUID;
  // uuidPlayer: number;
  // uuidGame: number;
  // uuidEvent: number;
  // idEvent?: number; 
};

const myEvent = { uuidRoom: '123' }








document.body.textContent = greeter(user);