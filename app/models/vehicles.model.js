module.exports = (mongoose, schema, model) => {
    const mongooseDelete = require('mongoose-delete');
    return model("vehicles", new schema(
        {
            name: {
                type: String,
                required: true,
            },
            courierId: {
                type: Number,
                required: true
            },
            typeId: {
                type: schema.Types.ObjectId,
                ref: "types",
                unique: true
            }
        },
        {collection: "vehicles", timestamps: {createdAt: 'createdAt'}}
    ).plugin(mongooseDelete, {deletedAt: true}));
};