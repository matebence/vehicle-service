module.exports = app => {
    const types = require("../controllers/types.controller");
    const router = require("express").Router();

    router.post("/", types.create.authorize, types.create.checkBody, types.create.validate, types.create.inDatabase);

    router.delete("/:id", types.delete.authorize, types.delete.validate, types.delete.inDatabase);

    router.put("/:id", types.update.authorize, types.update.checkBody, types.update.validate, types.update.inDatabase);

    router.get("/:id", types.get.authorize, types.get.validate, types.get.inDatabase);

    router.get("/page/:pageNumber/limit/:pageSize", types.getAll.authorize, types.getAll.validate, types.getAll.inDatabase);

    router.post("/search", types.search.authorize, types.search.checkBody, types.search.inDatabase);

    app.use('/api/types', router);
};