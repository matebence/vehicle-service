module.exports = (mongoose, schema, model) => {
    const mongooseDelete = require('mongoose-delete');
    return model("types", new schema(
        {
            name: {
                type: String,
                required: true,
                unique: true
            }
        },
        {collection: "types", timestamps: {createdAt: 'createdAt'}}
    ).plugin(mongooseDelete, {deletedAt: true}));
};