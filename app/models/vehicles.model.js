module.exports = (mongoose, schema, model) => {
    const mongooseDelete = require('mongoose-delete');
    const vehiclesSchema = new schema(
        {
            name: {
                type: String,
                required: true,
            },
            courierId: {
                type: Number,
                required: true
            },
            type: {
                type: schema.Types.ObjectId,
                ref: "types",
                required: true
            }
        },
        {collection: "vehicles", timestamps: {createdAt: 'createdAt'}}
    ).plugin(mongooseDelete, {deletedAt: true});

    return model("vehicles", vehiclesSchema);
};