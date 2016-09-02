var mongoose=require('mongoose'),
 Schema = mongoose.Schema;

var FacilityOwnersSchema = new Schema ({
    Group : String, 
    Owner : String, 
    backed_up : Number, 
    created_at : { type: Date,required:true}, 
    id : Number, 
    updated_at : { type: Date,required:true}
},{collection: 'FacilityOwners'});

module.exports = mongoose.model('FacilityOwners', FacilityOwnersSchema);