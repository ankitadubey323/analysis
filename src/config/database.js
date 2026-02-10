import mongoose from 'mongoose'
const connectdb=async()=>{
    try{
       await mongoose.connect(process.env.MONGO_URI)

       console.log('Database connected successfully')

    }catch(error){
        throw new Error('Error connecting to database')


    }
}
export default connectdb