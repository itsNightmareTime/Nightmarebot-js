import { Schema, model } from 'mongoose';

interface IUser {
  discordId: string;
  steamId: string
  userName: string;
}

const userSchema = new Schema<IUser>({
  discordId: { type: String, required: true },
  steamId: { type: String, required: true },
  userName: { type: String, required: true },
});

const userModel = model<IUser>('User', userSchema)

export default userModel