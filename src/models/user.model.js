import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        //Para que me elimine los espacios y se quede solo con el texto
        trim: true
    },
    email: {
        type: String,
        required: true,
        //Solo se absorbe como valido un email
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    picture:{
        type: String
    },
    token: {
        type: String
    }

}, {
    timestamps: true
});

userSchema.pre("save", async function(next){
    if (!this.isModified('password')){
          next();
    }
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt)
  });
  
  userSchema.methods.passwordCheck = async function (formPassword) {
      return bcrypt.compare(formPassword, this.password)
  }

export default mongoose.model('User', userSchema);