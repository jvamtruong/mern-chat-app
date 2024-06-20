import mongoose from "mongoose"

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log('connected to db')
  }
  catch (err) {
    console.log(err.messsage)
  }
}

export default connectToMongoDB