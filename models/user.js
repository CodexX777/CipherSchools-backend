const mongoose=require('mongoose');

const Schema=mongoose.Schema;
const uniqueValidator=require('mongoose-unique-validator');

const userSchema=new Schema({
    FirstName: {type:String, required:true},
    LastName:{type:String, required:true},
    PhoneNo: {type:Number, required:true, minlength:10},
    Email: {type:String, required:true,unique:true},
    password: {type:String , required:true, minlength:6},
    followers: [{type:mongoose.Types.ObjectId, required:true,ref:'User'}],
    Links:[{type:String, required:false}],
    Interests:[{name:{type:String, required:true},id:{type:Number, required:true}}],
    ProfessionalInfo:[{type:String, required:true}]
});

userSchema.plugin(uniqueValidator);

module.exports=mongoose.model('User',userSchema);
 