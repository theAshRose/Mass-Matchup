const News = require('../models/News');

const gameNewsData = [
];

const seedGameNews = () => News.bulkCreate(gameNewsData);

module.exports = seedGameNews;