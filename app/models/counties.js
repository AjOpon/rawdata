var mongoose=require('mongoose'),
 Schema = mongoose.Schema;

var CountySchema = new Schema ({
    Name : String, 
    backed_up : Number, 
    created_at : { type: Date,required:true}, 
    id: Number, 
    updated_at : { type: Date,required:true}

},{collection: 'counties'});

 module.exports = mongoose.model('Counties', CountySchema);