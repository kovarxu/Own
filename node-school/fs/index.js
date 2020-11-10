const fs = require('fs');

const stat = fs.statSync('something.json');

console.log(stat);

console.log(parseInt((stat.mode & parseInt ("777", 8)).toString(2), 10));
