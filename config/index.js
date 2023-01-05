// set up config file
var config = {
    apiUrl: process.env.API_URL || "http://localhost:3000",
    db: process.env.MONGODB_URI,
    authProviders: {
        email: {
            user: process.env.EMAIL_USER,
            password: process.env.EMAIL_PASSWORD,
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            from: process.env.EMAIL_FROM
        },
        google: {
            id: process.env.GOOGLE_ID,
            secret: process.env.GOOGLE_SECRET,
        },
        facebook: {
            id: process.env.FACEBOOK_ID,
            secret: process.env.FACEBOOK_SECRET,
        },
    }
};

// export the config file
module.exports = config