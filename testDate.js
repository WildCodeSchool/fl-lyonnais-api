const twoDaysAgo = new Date(Date.now() - (48 * 60 * 60 * 1000)).toISOString().slice(0, 10);
const userRegistrationDate = '2020-07-04T22:00:00.000Z';

console.log(twoDaysAgo);
console.log(userRegistrationDate.toString().substring(0, 10));
console.log(twoDaysAgo <= userRegistrationDate);
