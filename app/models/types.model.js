module.exports = (mongoose, schema, model) => {
    const mongooseDelete = require('mongoose-delete');
    const typesSchema = new schema(
        {
            name: {
                type: String,
                required: true
            }
        },
        {collection: "types", timestamps: {createdAt: 'createdAt'}}
    ).plugin(mongooseDelete, {deletedAt: true});

    return model("types", typesSchema);
};