import mongoose from 'mongoose'

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('connected to db')
  } catch (error) {
    console.error('error in connectToMongoDB func', error)
  }
}

export default connectToMongoDB