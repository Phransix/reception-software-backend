

/* Function to generate combination of password */
function generatePass() {
    let pass = '';
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz0123456789@#$';
 
    for (let i = 1; i <= 8; i++) {
        let char = Math.floor(Math.random()
            * str.length + 1);
 
        pass += str.charAt(char)
    }
 
    return pass;
}
 
console.log(generatePass());



// import crypto from 'crypto';

// const generateTemporaryPassword = () => {
//   const length = 10; // Length of the temporary password
//   return crypto.randomBytes(length).toString('hex');
// };
