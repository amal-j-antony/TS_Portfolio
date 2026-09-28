import bcrypt from 'bcrypt'
import { db, sql } from '../db/index.js'


export const loginController = (req,res) => {
    const {
        email,
        password
    } = req.body

    try {
        const result = await sql`SELECT * FROM userSchema`
    } catch (error) {
        
    }
}