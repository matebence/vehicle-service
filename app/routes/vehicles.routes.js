module.exports = app => {
    const warehouses = require("../controllers/vehicles.controller");
    const router = require("express").Router();
    /**
     * @swagger
     * /api/vehicles:
     *    post:
     *      tags:
     *          - VehiclesResource
     *      summary: create
     *      description: ''
     *      operationId: createUsingPOST
     *      consumes:
     *        - application/json
     *      produces:
     *        - application/json
     *      parameters:
     *        - name: vehicles
     *          in: body
     *          schema:
     *            $ref: "#/definitions/Vehicles"
     *          required: true
     *      responses:
     *        201:
     *          description: Created
     *        401:
     *          description: Unauthorized
     *        403:
     *          description: Forbidden
     *        404:
     *          description: Not Found
     * definitions:
     *      Vehicles:
     *          type: object
     */
    router.post("/", warehouses.create.authorize, warehouses.create.checkBody, warehouses.create.validate, warehouses.create.inDatabase);
    /**
     * @swagger
     * /api/vehicles/{vehicleId}:
     *    delete:
     *      tags:
     *          - VehiclesResource
     *      summary: delete
     *      description: ''
     *      operationId: deleteUsingDELETE
     *      consumes:
     *        - application/json
     *      produces:
     *        - application/json
     *      parameters:
     *        - name: vehicleId
     *          in: path
     *          description: ''
     *          required: true
     *          type: integer
     *          format: int64
     *      responses:
     *        200:
     *          description: OK
     *        204:
     *          description: Not Content
     *        401:
     *          description: Unauthorized
     *        403:
     *          description: Frobidden
     */
    router.delete("/:id", warehouses.delete.authorize, warehouses.delete.validate, warehouses.delete.inDatabase);
    /**
     * @swagger
     * /api/vehicles/{vehicleId}:
     *    put:
     *      tags:
     *          - VehiclesResource
     *      summary: update
     *      description: ''
     *      operationId: updateUsingPUT
     *      consumes:
     *        - application/json
     *      produces:
     *        - application/json
     *      parameters:
     *        - name: vehicles
     *          in: body
     *          schema:
     *            $ref: "#/definitions/Vehicles"
     *          required: true
     *        - name: vehicleId
     *          in: path
     *          description: ''
     *          required: true
     *          type: integer
     *          format: int64
     *      responses:
     *        200:
     *          description: OK
     *        201:
     *          description: Created
     *        401:
     *          description: Unauthorized
     *        403:
     *          description: Forbidden
     *        404:
     *          description: Not Found
     */
    router.put("/:id", warehouses.update.authorize, warehouses.update.checkBody, warehouses.update.validate, warehouses.update.inDatabase);
    /**
     * @swagger
     * /api/vehicles/{vehicleId}:
     *    get:
     *      tags:
     *          - VehiclesResource
     *      summary: get
     *      description: ''
     *      operationId: getUsingGET
     *      consumes:
     *        - application/json
     *      produces:
     *        - application/json
     *      parameters:
     *        - name: vehicleId
     *          in: path
     *          description: ''
     *          required: true
     *          type: integer
     *          format: int64
     *      responses:
     *        200:
     *          description: OK
     *        401:
     *          description: Unauthorized
     *        403:
     *          description: Forbidden
     *        404:
     *          description: Not Found
     */
    router.get("/:id", warehouses.get.authorize, warehouses.get.validate, warehouses.get.inDatabase);
    /**
     * @swagger
     * /api/vehicles/page/{pageNumber}/limit/{pageSize}:
     *    get:
     *      tags:
     *          - VehiclesResource
     *      summary: getAll
     *      description: ''
     *      operationId: getAllUsingGET
     *      consumes:
     *        - application/json
     *      produces:
     *        - application/json
     *      parameters:
     *        - name: pageNumber
     *          in: path
     *          description: ''
     *          required: true
     *          type: integer
     *          format: int64
     *        - name: pageSize
     *          in: path
     *          description: ''
     *          required: true
     *          type: integer
     *          format: int64
     *      responses:
     *        200:
     *          description: OK
     *        401:
     *          description: Unauthorized
     *        403:
     *          description: Forbidden
     *        404:
     *          description: Not Found
     */
    router.get("/page/:pageNumber/limit/:pageSize", warehouses.getAll.authorize, warehouses.getAll.validate, warehouses.getAll.inDatabase);
    /**
     * @swagger
     * /api/vehicles/search:
     *    post:
     *      tags:
     *          - VehiclesResource
     *      summary: search
     *      description: ''
     *      operationId: searchUsingPOST
     *      consumes:
     *        - application/json
     *      produces:
     *        - application/json
     *      parameters:
     *        - name: criterias
     *          in: body
     *          schema:
     *            type: object
     *          required: true
     *      responses:
     *        200:
     *          description: OK
     *        201:
     *          description: Created
     *        401:
     *          description: Unauthorized
     *        403:
     *          description: Forbidden
     *        404:
     *          description: Not Found
     */
    router.post("/search", warehouses.search.authorize, warehouses.search.checkBody, warehouses.search.inDatabase);

    app.use('/api/vehicles', router);
};