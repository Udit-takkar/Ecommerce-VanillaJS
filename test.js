// // I did not understand this? 
// const wait = time => new Promise((resolve) => setTimeout(resolve, time));

// wait(3000).then(() => console.log('Hello!')); // 'Hello!'

var employeeDetailsOriginal = {  name: 'Manjula', age: 25, Profession: 'Software Engineer' };
var employeeDetailsDuplicate = employeeDetailsOriginal; //Shallow copy!
employeeDetailsDuplicate.name = 'NameChanged';

console.log(employeeDetailsOriginal);