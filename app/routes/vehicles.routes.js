module.exports = app => {
    const vehicles = require("../controllers/vehicles.controller");
    const router = require("express").Router();

    router.post("/", vehicles.create.authorize, vehicles.create.checkBody, vehicles.create.validate, vehicles.create.inDatabase);

    router.delete("/:id", vehicles.delete.authorize, vehicles.delete.validate, vehicles.delete.inDatabase);

    router.put("/:id", vehicles.update.authorize, vehicles.update.checkBody, vehicles.update.validate, vehicles.update.inDatabase);

    router.get("/:id", vehicles.get.authorize, vehicles.get.validate, vehicles.get.inDatabase);

    router.get("/page/:pageNumber/limit/:pageSize", vehicles.getAll.authorize, vehicles.getAll.validate, vehicles.getAll.inDatabase);

    router.post("/search", vehicles.search.authorize, vehicles.search.checkBody, vehicles.search.inDatabase);

    router.post("/join/:columnName", vehicles.join.authorize, vehicles.join.checkBody, vehicles.join.validate, vehicles.join.inDatabase);

    app.use('/api/vehicles', router);
};