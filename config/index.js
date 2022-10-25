// set up config file
var config = {
    apiUrl: "http://localhost:3000",
    db: process.env.MONGODB_URI,
};

// export the config file
module.exports = config