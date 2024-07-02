import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'newsfeed' })
class NewsfeedDocument extends Document {
  @Prop({ required: true, index: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: false })
  url: string;

  @Prop({ required: false })
  image: string;

  @Prop({ default: false, index: true })
  isDeleted: boolean;
}
const NewsfeedSchema = SchemaFactory.createForClass(NewsfeedDocument);

export { NewsfeedSchema, NewsfeedDocument };
