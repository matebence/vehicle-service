const {validationResult, check} = require('express-validator/check');
const crypto = require('crypto-js');

const strings = require('../../resources/strings');
const database = require("../models");

const Users = require('../component/resilient.component');
const Vehicles = database.vehicles;

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_NUMBER = 1;

exports.create = {
    authorize: (req, res, next) => {
        if (!req.hasRole(['ROLE_SYSTEM', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_COURIER'])) {
            return res.status(401).json({
                timestamp: new Date().toISOString(),
                message: strings.AUTH_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next()
    },
    checkBody: (req, res, next) => {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                timestamp: new Date().toISOString(),
                message: strings.SERVER_REQUEST_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next();
    },
    validate: [
        check('name')
            .isLength({min: 3, max: 64}).withMessage(strings.VEHICLE_NAME_LENGHT)
            .matches(/^[\D ]+$/).withMessage(strings.VEHICLE_NAME_MATCHES),
        check('courier')
            .isInt({min: 1}).withMessage(strings.VEHICLE_COURIER_ID_INT),
        check('type')
            .isMongoId().withMessage(strings.TYPE_MONGO_ID),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    timestamp: new Date().toISOString(),
                    message: strings.SERVER_VALIDATION_ERR,
                    error: true,
                    validations: errors.array(),
                    nav: `${req.protocol}://${req.get('host')}`
                });
            }
            next()
        }
    ],
    inDatabase: (req, res, next) => {
        return Promise.all([Vehicles.startSession(), Vehicles(req.body).save()]).then(([session, data]) => {
            session.startTransaction();
            if (data) {
                session.commitTransaction().then(() => {
                    session.endSession();
                    return res.status(201).json(data, [
                        {rel: "vehicle", method: "GET", href: `${req.protocol}://${req.get('host')}/api/vehicles/${data._id}`}]);
                });
            } else {
                session.abortTransaction().then(() => {
                    session.endSession();
                });
                throw strings.CREATE_VEHICLE_ERR;
            }
        }).catch(err => {
            return res.status(500).json({
                timestamp: new Date().toISOString(),
                message: strings.CREATE_VEHICLE_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        });
    }
};

exports.delete = {
    authorize: (req, res, next) => {
        if (!req.hasRole(['ROLE_SYSTEM', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_COURIER'])) {
            return res.status(401).json({
                timestamp: new Date().toISOString(),
                message: strings.AUTH_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next()
    },
    validate: [
        check('id')
            .isMongoId().withMessage(strings.VEHICLE_MONGO_ID),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    timestamp: new Date().toISOString(),
                    message: strings.SERVER_VALIDATION_ERR,
                    error: true,
                    validations: errors.array(),
                    nav: `${req.protocol}://${req.get('host')}`
                });
            }
            next()
        }
    ],
    inDatabase: (req, res, next) => {
        return Promise.all([Vehicles.startSession(), Vehicles.delete({_id: database.mongoose.Types.ObjectId(req.params.id), deleted: false})]).then(([session, data]) => {
            session.startTransaction();
            if (data.n === 1) {
                session.commitTransaction().then(() => {
                    session.endSession();
                    return res.status(200).json({});
                });
            } else {
                session.abortTransaction().then(() => {
                    session.endSession();
                    return res.status(400).json({
                        timestamp: new Date().toISOString(),
                        message: strings.GET_VEHICLE_ERR,
                        error: true,
                        nav: `${req.protocol}://${req.get('host')}`
                    });
                });
            }
        }).catch(err => {
            return res.status(500).json({
                timestamp: new Date().toISOString(),
                message: strings.DELETE_VEHICLE_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        });
    }
};

exports.update = {
    authorize: (req, res, next) => {
        if (!req.hasRole(['ROLE_SYSTEM', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_COURIER'])) {
            return res.status(401).json({
                timestamp: new Date().toISOString(),
                message: strings.AUTH_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next()
    },
    checkBody: (req, res, next) => {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                timestamp: new Date().toISOString(),
                message: strings.SERVER_REQUEST_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next();
    },
    validate: [
        check('id')
            .isMongoId().withMessage(strings.VEHICLE_MONGO_ID),
        check('name')
            .isLength({min: 3, max: 64}).withMessage(strings.VEHICLE_NAME_LENGHT)
            .matches(/^[\D ]+$/).withMessage(strings.VEHICLE_NAME_MATCHES),
        check('courier')
            .isInt({min: 1}).withMessage(strings.VEHICLE_COURIER_ID_INT),
        check('type')
            .isMongoId().withMessage(strings.TYPE_MONGO_ID),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    timestamp: new Date().toISOString(),
                    message: strings.SERVER_VALIDATION_ERR,
                    error: true,
                    validations: errors.array(),
                    nav: `${req.protocol}://${req.get('host')}`
                });
            }
            next()
        }
    ],
    inDatabase: (req, res, next) => {
        return Promise.all([Vehicles.startSession(), Vehicles.findOneAndUpdate({_id: req.params.id}, req.body)]).then(([session, data]) => {
            session.startTransaction();
            if (data) {
                session.commitTransaction().then(() => {
                    session.endSession();
                    return res.status(200).json({});
                });
            } else {
                session.abortTransaction().then(() => {
                    session.endSession();
                    return res.status(500).json({
                        timestamp: new Date().toISOString(),
                        message: strings.UPDATE_VEHICLE_ERR,
                        error: true,
                        nav: `${req.protocol}://${req.get('host')}`
                    });
                });
            }
        }).catch(err => {
            return res.status(400).json({
                timestamp: new Date().toISOString(),
                message: strings.GET_VEHICLE_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        });
    }
};

exports.get = {
    authorize: (req, res, next) => {
        if (!req.hasRole(['ROLE_SYSTEM', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_COURIER'])) {
            return res.status(401).json({
                timestamp: new Date().toISOString(),
                message: strings.AUTH_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next()
    },
    validate: [
        check('id')
            .isMongoId().withMessage(strings.VEHICLE_MONGO_ID),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    timestamp: new Date().toISOString(),
                    message: strings.SERVER_VALIDATION_ERR,
                    error: true,
                    validations: errors.array(),
                    nav: `${req.protocol}://${req.get('host')}`
                });
            }
            next()
        }
    ],
    inDatabase: (req, res, next) => {
        return Promise.all([Vehicles.startSession(), Vehicles.findOne({_id: req.params.id, deleted: false }).populate({path:"type", model:"types"})]).then(([session, data]) => {
            session.startTransaction();
            if (data) {
                session.commitTransaction().then(() => {
                    session.endSession();
                    req.vehicles = data;
                    req.hateosLinks = [
                        {rel: "self", method: "GET", href: req.protocol + '://' + req.get('host') + req.originalUrl},
                        {rel: "all-vehicles", method: "GET", href: `${req.protocol}://${req.get('host')}/api/vehicles/page/${DEFAULT_PAGE_NUMBER}/limit/${DEFAULT_PAGE_SIZE}`}];
                    next();
                });
            } else {
                session.abortTransaction().then(() => {
                    session.endSession();
                    return res.status(400).json({
                        timestamp: new Date().toISOString(),
                        message: strings.GET_VEHICLE_ERR,
                        error: true,
                        nav: `${req.protocol}://${req.get('host')}`
                    });
                });
            }
        }).catch(err => {
            return res.status(500).json({
                timestamp: new Date().toISOString(),
                message: strings.VEHICLE_NOT_FOUND,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        });
    },
    fetchDataFromService: (req, res, next) => {
        const proxy = Users.resilient("USER-SERVICE");
        const users = req.vehicles.courier;

        proxy.post('/users/join/accountId', {data: [req.vehicles.courier]}).then(response => {
            if (response.status >= 300 && !'error' in response.data) return new Error(strings.PROXY_ERR);
            database.redis.setex(crypto.MD5(`users-${users}`).toString(), 3600, JSON.stringify(response.data));

            const vehicles = [req.vehicles].map(e => {
                const {firstName, lastName, userName, email} = response.data.find(x => x.accountId === e.courier);
                return {...e._doc, courier: {courierId: e.courier, name: `${firstName} ${lastName}`, userName: userName, email: email}};
            }).pop();

            return res.status(200).json(vehicles, req.hateosLinks);
        }).catch(err => {
            req.cacheId = users;
            next();
        });
    },
    fetchDataFromCache: (req, res, next) => {
        database.redis.get(crypto.MD5(`users-${req.cacheId}`).toString(), (err, data) => {
            if (!data) {
                return res.status(500).json({
                    timestamp: new Date().toISOString(),
                    message: strings.VEHICLE_NOT_FOUND,
                    error: true,
                    nav: `${req.protocol}://${req.get('host')}`
                });
            } else{
                try{
                    const vehicles = [req.vehicles].map(e => {
                        const {firstName, lastName, userName, email} = JSON.parse(data).find(x => x.accountId === e.courier);
                        return {...e._doc, courier: {courierId: e.courier, name: `${firstName} ${lastName}`, userName: userName, email: email}};
                    }).pop();

                    return res.status(200).json(vehicles, req.hateosLinks);
                }catch(err){
                    return res.status(500).json({
                        timestamp: new Date().toISOString(),
                        message: strings.VEHICLE_NOT_FOUND,
                        error: true,
                        nav: `${req.protocol}://${req.get('host')}`
                    });
                }
            }
        });
    }
};

exports.getAll = {
    authorize: (req, res, next) => {
        if (!req.hasRole(['ROLE_SYSTEM', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_COURIER'])) {
            return res.status(401).json({
                timestamp: new Date().toISOString(),
                message: strings.AUTH_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next()
    },
    validate: [
        check('pageNumber')
            .isInt({min: 1}).withMessage(strings.VEHICLE_PAGE_NUMBER_INT),
        check('pageSize')
            .isInt({min: 1}).withMessage(strings.VEHICLE_PAGE_SIZE_INT),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    timestamp: new Date().toISOString(),
                    message: strings.SERVER_VALIDATION_ERR,
                    error: true,
                    validations: errors.array(),
                    nav: `${req.protocol}://${req.get('host')}`
                });
            }
            next()
        }
    ],
    inDatabase: (req, res, next) => {
        return Promise.all([Vehicles.startSession(), Vehicles.find({deleted: false}).populate({path:"type", model:"types"}).sort('createdAt').skip((Number(req.params.pageNumber) - 1) * Number(req.params.pageSize)).limit(Number(req.params.pageSize))]).then(([session, data]) => {
            session.startTransaction();
            if (data.length > 0 || data !== undefined) {
                session.commitTransaction().then(() => {
                    session.endSession();
                    req.vehicles = data;
                    req.hateosLinks = [
                        {rel: "self", method: "GET", href: req.protocol + '://' + req.get('host') + req.originalUrl},
                        {rel: "next-range", method: "GET", href: `${req.protocol}://${req.get('host')}/api/vehicles/page/${1 + Number(req.params.pageNumber)}/limit/${req.params.pageSize}`}];
                    next();
                });
            } else {
                session.abortTransaction().then(() => {
                    session.endSession();
                    return res.status(400).json({
                        timestamp: new Date().toISOString(),
                        message: strings.VEHICLE_NOT_FOUND,
                        error: true,
                        nav: `${req.protocol}://${req.get('host')}`
                    });
                });
            }
        }).catch(err => {
            return res.status(500).json({
                timestamp: new Date().toISOString(),
                message: strings.VEHICLE_NOT_FOUND,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        });
    },
    fetchDataFromService: (req, res, next) => {
        const proxy = Users.resilient("USER-SERVICE");
        const users = req.vehicles.filter(e => e.courier).map(x => x.courier);

        proxy.post('/users/join/accountId', {data: users}).then(response => {
            if (response.status >= 300 && !'error' in response.data) return new Error(strings.PROXY_ERR);
            response.data.forEach(e => {database.redis.setex(crypto.MD5(`users-${e.accountId}`).toString(), 3600, JSON.stringify(e))});

            const vehicles = req.vehicles.map(e => {
                const {userName, email} = response.data.find(x => x.accountId === e.courier);
                return {...e._doc, courier: {courierId: e.courier, userName: userName, email: email}};
            });

            return res.status(206).json({data: vehicles}, req.hateosLinks);
        }).catch(err => {
            req.cacheId = users;
            next();
        });
    },
    fetchDataFromCache: (req, res, next) => {
        database.redis.mget(req.cacheId.map(e => {return crypto.MD5(`users-${e}`).toString()}), (err, data) => {
            if (!data) {
                return res.status(500).json({
                    timestamp: new Date().toISOString(),
                    message: strings.VEHICLE_NOT_FOUND,
                    error: true,
                    nav: `${req.protocol}://${req.get('host')}`
                });
            } else {
                try{
                    data = JSON.stringify(data.map(e => {return JSON.parse(e)}));
                    const vehicles = req.vehicles.map(e => {
                        const {firstName, lastName, userName, email} = JSON.parse(data).find(x => x.accountId === e.courier);
                        return {...e._doc, courier: {courierId: e.courier, name: `${firstName} ${lastName}`, userName: userName, email: email}};
                    });

                    return res.status(206).json({data: vehicles}, req.hateosLinks);
                } catch(err) {
                    return res.status(500).json({
                        timestamp: new Date().toISOString(),
                        message: strings.VEHICLE_NOT_FOUND,
                        error: true,
                        nav: `${req.protocol}://${req.get('host')}`
                    });
                }
            }
        });
    }
};

exports.search = {
    authorize: (req, res, next) => {
        if (!req.hasRole(['ROLE_SYSTEM', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_COURIER'])) {
            return res.status(401).json({
                timestamp: new Date().toISOString(),
                message: strings.AUTH_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next()
    },
    checkBody: (req, res, next) => {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                timestamp: new Date().toISOString(),
                message: strings.SERVER_REQUEST_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next();
    },
    inDatabase: (req, res, next) => {
        const pagination = req.body.pagination;
        let order = req.body.orderBy;
        let search = req.body.search;
        let hateosLinks = [];

        if (order) {
            Object.keys(order).map(function (key, index) {
                if (order[key].toLowerCase() === 'asc') {
                    order[key] = 1;
                } else if (order[key].toLowerCase() === 'desc') {
                    order[key] = -1;
                }
            });
        }
        if (search) {
            Object.keys(search).map(function (key, index) {
                if(isNaN(search[key]) &&  new RegExp("^[0-9a-fA-F]{24}$").test(search[key])){
                    search[key] = database.mongoose.Types.ObjectId(search[key])
                } else if (Array.isArray(search[key])){
                    search[key] = {$in: search[key]}
                } else if (isNaN(search[key])){
                    search[key] = {$regex: new RegExp("^.*" + search[key] + '.*', "i")}
                }
            });
        }
        Vehicles.countDocuments({deleted: false, ...search}, (err, count) => {
            hateosLinks.push({rel: "self", method: "GET", href: req.protocol + '://' + req.get('host') + req.originalUrl});
            if (Number(pagination.pageNumber) > 1) hateosLinks.push({rel: "has-prev", method: "POST", href: `${req.protocol}://${req.get('host')}/api/vehicles/search`});
            if ((Number(pagination.pageNumber) * Number(pagination.pageSize)) < count) hateosLinks.push({rel: "has-next", method: "POST", href: `${req.protocol}://${req.get('host')}/api/vehicles/search`});
        });

        return Promise.all([Vehicles.startSession(), Vehicles.find({deleted: false, ...search}).populate({path:"type", model:"types"}).sort(order).skip((Number(pagination.pageNumber) - 1) * Number(pagination.pageSize)).limit(Number(pagination.pageSize))]).then(([session, data]) => {
            session.startTransaction();
            if (data.length > 0 || data !== undefined) {
                session.commitTransaction().then(() => {
                    session.endSession();
                    req.vehicles = data;
                    req.hateosLinks = hateosLinks;
                    next();
                });
            } else {
                session.abortTransaction().then(() => {
                    session.endSession();
                    return res.status(400).json({
                        timestamp: new Date().toISOString(),
                        message: strings.VEHICLE_NOT_FOUND,
                        error: true,
                        nav: `${req.protocol}://${req.get('host')}`
                    });
                });
            }
        }).catch(err => {
            return res.status(500).json({
                timestamp: new Date().toISOString(),
                message: strings.VEHICLE_NOT_FOUND,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        });
    },
    fetchDataFromService: (req, res, next) => {
        const proxy = Users.resilient("USER-SERVICE");
        const users = req.vehicles.filter(e => e.courier).map(x => x.courier);

        proxy.post('/users/join/accountId', {data: users}).then(response => {
            if (response.status >= 300 && !'error' in response.data) return new Error(strings.PROXY_ERR);
            response.data.forEach(e => {database.redis.setex(crypto.MD5(`users-${e.accountId}`).toString(), 3600, JSON.stringify(e))});

            const vehicles = req.vehicles.map(e => {
                const {userName, email} = response.data.find(x => x.accountId === e.courier);
                return {...e._doc, courier: {courierId: e.courier, userName: userName, email: email}};
            });

            return res.status(200).json({data: vehicles}, req.hateosLinks);
        }).catch(err => {
            req.cacheId = users;
            next();
        });
    },
    fetchDataFromCache: (req, res, next) => {
        database.redis.mget(req.cacheId.map(e => {return crypto.MD5(`users-${e}`).toString()}), (err, data) => {
            if (!data) {
                return res.status(500).json({
                    timestamp: new Date().toISOString(),
                    message: strings.VEHICLE_NOT_FOUND,
                    error: true,
                    nav: `${req.protocol}://${req.get('host')}`
                });
            } else {
                try{
                    data = JSON.stringify(data.map(e => {return JSON.parse(e)}));
                    const vehicles = req.vehicles.map(e => {
                        const {firstName, lastName, userName, email} = JSON.parse(data).find(x => x.accountId === e.courier);
                        return {...e._doc, courier: {courierId: e.courier, name: `${firstName} ${lastName}`, userName: userName, email: email}};
                    });

                    return res.status(200).json({data: vehicles}, req.hateosLinks);
                } catch(err) {
                    return res.status(500).json({
                        timestamp: new Date().toISOString(),
                        message: strings.VEHICLE_NOT_FOUND,
                        error: true,
                        nav: `${req.protocol}://${req.get('host')}`
                    });
                }
            }
        });
    }
};

exports.join = {
    authorize: (req, res, next) => {
        if (!req.hasRole(['ROLE_SYSTEM'])) {
            return res.status(401).json({
                timestamp: new Date().toISOString(),
                message: strings.AUTH_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next()
    },
    checkBody: (req, res, next) => {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                timestamp: new Date().toISOString(),
                message: strings.SERVER_REQUEST_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next()
    },
    validate: [
        check('columnName')
            .matches(/^_|[a-zA-Z]+$/).withMessage(strings.VEHICLE_PAGE_SIZE_INT),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    timestamp: new Date().toISOString(),
                    message: strings.SERVER_VALIDATION_ERR,
                    error: true,
                    validations: errors.array(),
                    nav: `${req.protocol}://${req.get('host')}`
                });
            }
            next()
        }
    ],
    inDatabase: (req, res, next) => {
        let ids = {[`${req.params.columnName}`]: {$in: []}};
        if (req.body) {
            for (const element of req.body) {
                req.params.columnName === "_id"?ids[`${req.params.columnName}`].$in.push(database.mongoose.Types.ObjectId(element)):ids[`${req.params.columnName}`].$in.push(element)
            }
        }

        return Promise.all([Vehicles.startSession(), Vehicles.find({deleted: false, ...ids}).populate({path:"type", model:"types"})]).then(([session, data]) => {
            session.startTransaction();
            if (data.length > 0 || data !== undefined) {
                session.commitTransaction().then(() => {
                    session.endSession();
                    return res.status(200).json(data);
                });
            } else {
                session.abortTransaction().then(() => {
                    session.endSession();
                    return res.status(400).json({
                        timestamp: new Date().toISOString(),
                        message: strings.VEHICLE_NOT_FOUND,
                        error: true,
                        nav: `${req.protocol}://${req.get('host')}`
                    });
                });
            }
        }).catch(err => {
            return res.status(500).json({
                timestamp: new Date().toISOString(),
                message: strings.VEHICLE_NOT_FOUND,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        });
    }
};