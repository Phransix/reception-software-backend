import * as bcrypt from 'bcrypt'


export const hashPassword = async (password: string) => {
    const saltRounds = 10 ;
    const hashPassword = await bcrypt.hash(password,saltRounds)
    return hashPassword
};


export const comparePassword = async (password: string, hashedPassword: string) => {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  };