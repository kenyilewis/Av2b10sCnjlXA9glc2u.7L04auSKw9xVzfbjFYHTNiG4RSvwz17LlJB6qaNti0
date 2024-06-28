import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'users' })
class UserDocument extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isDeleted: boolean;
}

const UserSchema = SchemaFactory.createForClass(UserDocument);
UserSchema.index({ isDeleted: 1, email: 1 }); // TODO: Add isDeleted in persistence layer

export { UserSchema, UserDocument };
