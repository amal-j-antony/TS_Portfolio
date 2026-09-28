import express  from 'express'

export const mainRouter = express.Router()

mainRouter.get('/',(req, res) => {
    res.status(200).json('Server Running!')
})