import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Roles } from "../../../../common/enums/roles.enum";

@Schema({ timestamps: true, collection: 'users' })
class UserDocument extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false, index: true })
  isDeleted: boolean;

  @Prop({ default: [Roles.USER] })
  roles: Roles[];
}

const UserSchema = SchemaFactory.createForClass(UserDocument);
UserSchema.index({ isDeleted: 1, email: 1 });

export { UserSchema, UserDocument };
