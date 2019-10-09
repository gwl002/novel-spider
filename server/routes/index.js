const bussinessRoutes = require("./businessRoute.js");
const staticFileRoutes = require("./staticFileRoute.js");
const userRoutes = require("./userRoute.js");



module.exports = [].concat(bussinessRoutes).concat(staticFileRoutes).concat(userRoutes);