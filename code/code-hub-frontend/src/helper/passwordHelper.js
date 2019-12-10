import * as bcrypt from 'bcryptjs';

export function getPasswordHash(password) {
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    return hash;
}