var mongoose = require ("mongoose");
var schema = mongoose.schema;

var itemSchema = new schema ({
    title: {
        type: String,
        required: true
    },
    link: {
        type: string, 
        required: true
    },
    saved: {
        type: Boolean,
        default: false
    },
    note: {
        type: schema.types.objectId,
        ref: "note"
    }
});