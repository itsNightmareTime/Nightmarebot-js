import { User } from './user';
import { Bank } from './Bank';
import { Character } from './Character';
import { Inventory } from './Inventory';
import { Item } from './Item';
import { ItemStorage } from './ItemStorage';

User.hasMany(Character);
Character.hasOne(Inventory);
Character.hasOne(Bank);
Character.hasOne(ItemStorage);
Character.hasMany(Item);

export {
    User,
    Bank,
    Character,
    Inventory,
    Item,
    ItemStorage
};