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
]

const seedFriends = () => Friend.bulkCreate(friendData);

module.exports = seedFriends;