import { Schema, model, models, type Document, type Model } from "mongoose"

export interface IUser extends Document {
  clerkId?: string
  username?: string
  email: string
  password: string
  firstName?: string
  lastName?: string
  isVerified: boolean
  avatar?: string
  generationCount?: number
  uploadedImages?: string[]
  createdAt?: Date
  updatedAt?: Date
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: String,
    username: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    firstName: String,
    lastName: String,
    isVerified: { type: Boolean, default: false },
    avatar: { type: String, default: "https://cdn-icons-png.flaticon.com/512/11789/11789135.png" },
    generationCount: { type: Number, default: 0 },
    uploadedImages: [{ type: String }],
  },
  { timestamps: true },
)

export const User: Model<IUser> = models.User || model<IUser>("User", UserSchema)
export default User
