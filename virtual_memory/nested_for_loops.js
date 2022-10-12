const NUMBER = 10000;

// COLUMN FIRST
// ~ 3.9 seconds
const columnFirst = [];
for (let i = 0; i < NUMBER; i++) {
    columnFirst.push([]);
    for (let j = 0; j < NUMBER; j++) {
        columnFirst[i].push(1);
    }
}
console.time("Column First");
for (let j = 0; j < NUMBER; j++) {
    for (let i = 0; i < NUMBER; i++) {
        columnFirst[i][j] = 0;
    }
}
console.timeEnd("Column First");

// ROW FIRST
// ~ 123 ms
const rowFirst = [];
for (let i = 0; i < NUMBER; i++) {
    rowFirst.push([]);
    for (let j = 0; j < NUMBER; j++) {
        rowFirst[i].push(1);
    }
}
console.time("Row First");

for (let i = 0; i < NUMBER; i++) {
    for (let j = 0; j < NUMBER; j++) {
        rowFirst[i][j] = 0;
    }
}
console.timeEnd("Row First");