import mongoose from 'mongoose';

const { Schema, Model } = mongoose;

const userSchema = new Schema(
    {
        steamID: {
            type: Number,
            required: 'Please Provide a SteamID64',
            length: 17
        },
        userName: {
            type: String,
            required: 'Please Provide a userName'.
        }
    },
    {
        toJSON: {
            getters: true
        },
        id: false1
    }
);

const User = Model('User', userSchema);

module.exports = User;