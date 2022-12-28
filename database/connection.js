const mongoose = require("mongoose");

const connection = async () => {
    try {
        await mongoose.connect(process.env.DB);
        console.log("Database connected");
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    connection,
};
