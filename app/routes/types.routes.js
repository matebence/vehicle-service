module.exports = app => {
    const warehouses = require("../controllers/types.controller");
    const router = require("express").Router();
    /**
     * @swagger
     * /api/types:
     *    post:
     *      tags:
     *          - TypesResource
     *      summary: create
     *      description: ''
     *      operationId: createUsingPOST
     *      consumes:
     *        - application/json
     *      produces:
     *        - application/json
     *      parameters:
     *        - name: types
     *          in: body
     *          schema:
     *            $ref: "#/definitions/Types"
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
     *      Types:
     *          type: object
     */
    router.post("/", warehouses.create.authorize, warehouses.create.checkBody, warehouses.create.validate, warehouses.create.inDatabase);
    /**
     * @swagger
     * /api/types/{typeId}:
     *    delete:
     *      tags:
     *          - TypesResource
     *      summary: delete
     *      description: ''
     *      operationId: deleteUsingDELETE
     *      consumes:
     *        - application/json
     *      produces:
     *        - application/json
     *      parameters:
     *        - name: typeId
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
     * /api/types/{typeId}:
     *    put:
     *      tags:
     *          - TypesResource
     *      summary: update
     *      description: ''
     *      operationId: updateUsingPUT
     *      consumes:
     *        - application/json
     *      produces:
     *        - application/json
     *      parameters:
     *        - name: types
     *          in: body
     *          schema:
     *            $ref: "#/definitions/Types"
     *          required: true
     *        - name: typeId
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
     * /api/types/{typeId}:
     *    get:
     *      tags:
     *          - TypesResource
     *      summary: get
     *      description: ''
     *      operationId: getUsingGET
     *      consumes:
     *        - application/json
     *      produces:
     *        - application/json
     *      parameters:
     *        - name: typeId
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
     * /api/types/page/{pageNumber}/limit/{pageSize}:
     *    get:
     *      tags:
     *          - TypesResource
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
     * /api/types/search:
     *    post:
     *      tags:
     *          - TypesResource
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

    app.use('/api/types', router);
};