var mongoose = require ("mongoose");
var schema = mongoose.schema;

var articleSchema = new schema({
   title: {
       type: String,
       required: true,
       unique: true
   },
   link: {
      type: String, 
      required: true 
   },
   note: {
       type: schema.types.objectId,
       ref: "note" 
   }
});

var article = mongoose.model("article", articleSchema);
model.exports = article;