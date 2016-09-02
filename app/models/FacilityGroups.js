var mongoose=require('mongoose'),
 Schema = mongoose.Schema;

var FacilityGroupsSchema = new Schema ({
    FacilityGroup : String, 
    FacilityType : String, 
    backed_up : Number , 
    created_at : { type: Date,required:true}, 
    id : Number , 
    updated_at : { type: Date,required:true}


},{collection: 'FacilityGroups'});

module.exports = mongoose.model('FacilityGroups', FacilityGroupsSchema);