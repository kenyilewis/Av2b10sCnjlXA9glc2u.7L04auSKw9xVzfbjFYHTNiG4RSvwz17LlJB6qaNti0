import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserDocument } from '../../../../user/infrastructure/persistence/mongo-db/user.entity';

@Schema({ timestamps: true, collection: 'newsfeeds' })
class NewsfeedDocument extends Document {
  @Prop({ required: true, index: true, minlength: 3, maxlength: 255 })
  title: string;

  @Prop({ required: false })
  content?: string;

  @Prop()
  image?: string;

  @Prop()
  url?: string;

  @Prop({ default: false, index: true })
  isDeleted: boolean;

  @Prop({ type: Types.ObjectId, ref: UserDocument.name, required: true })
  author: UserDocument | Types.ObjectId | string;
}
const NewsfeedSchema = SchemaFactory.createForClass(NewsfeedDocument);

export { NewsfeedSchema, NewsfeedDocument };
