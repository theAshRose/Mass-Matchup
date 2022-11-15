const { Friend } = require('../models');

const friendData = [
    {
        friend_id: 2,
        link_id: 1,  
    },
    {
        friend_id: 3,
        link_id: 1,  
    },
    {
        friend_id: 4,
        link_id: 1,  
    },
    {
        friend_id: 5,
        link_id: 1,  
    },
    {
        friend_id: 4,
        link_id: 3
    },
    {
        friend_id: 2,
        link_id: 3
    },
    {
        friend_id: 8,
        link_id: 10
    },
    {
        friend_id: 8,
        link_id: 9
    },
    {
        friend_id: 7,
        link_id: 9
    },
    {
        friend_id: 8,
        link_id: 12
    }
]

const seedFriends = () => Friend.bulkCreate(friendData);

module.exports = seedFriends;