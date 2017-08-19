console.log('a');
let a = 1;
console.log(__filename);
console.log(__dirname);
function retrun(){
    return process.cwd();
}
module.exports = retrun();