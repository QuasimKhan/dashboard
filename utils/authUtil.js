import bcrypt from 'bcrypt';

const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        return hashedPass;
        
    } catch (error) {
        console.log(error);
        throw new Error('Error hashing password');
        
    }
}

const comparePassword = async (password, hashedPass) => {
    try {
        return await bcrypt.compare(password, hashedPass);
    } catch (error) {
        console.log(error);
        throw new Error('Error comparing passwords');
        
    }
}


export { hashPassword, comparePassword }