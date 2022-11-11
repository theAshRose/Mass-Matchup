const { FriendReq } = require('../models');

const friendData1 = [
    {
        friend_id_req: 3,
        link_id_req: 2,  
    },
    {
        friend_id_req: 4,
        link_id_req: 2,
    },
    {
        friend_id_req: 5,
        link_id_req: 2, 
    },
    {
        friend_id_req: 5,
        link_id_req: 3, 
    }
]

const seedFriendsReq = () => FriendReq.bulkCreate(friendData1);

module.exports = seedFriendsReq;