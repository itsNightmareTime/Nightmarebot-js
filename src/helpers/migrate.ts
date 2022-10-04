import { User } from "../models/user";
import currentUsers from './users.json';

type JSONUserData = {
    username: String;
    steamId: Number | String;
}

type JSONData = {
    [key: string]: {
        username: string;
        steamID: string;
    };
};

const userData = currentUsers as JSONData;

const failedUsers: JSONUserData[] = [];

for (const user in userData) {
    try {
        const {username, steamID } = userData[user];
        User.create({
            id: user,
            userName: username,
            steamId: steamID,
        });
    } catch (error) {
        const {username, steamID } = userData[user];
        console.log (`Unable to migrate User: ${user}`);
        failedUsers.push({ username, steamId: steamID });
    } finally {
        continue
    }
}