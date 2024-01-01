import {
  CreatedBy,
  Geometry,
  ModifiedBy,
  Position,
  SelfLink,
  ShapeStyleForCreate,
} from "@mirohq/miro-api/dist/api";
import mongoose, { Schema } from "mongoose";

export interface Item {
  shape: string;
  type: string;
  boardId: string;
  id: string;
  createdAt?: Date;
  createdBy?: CreatedBy;
  data?: object;
  geometry?: Geometry;
  links?: SelfLink;
  modifiedAt?: Date;
  modifiedBy?: ModifiedBy;
  position?: Position;
  style?: ShapeStyleForCreate;
}

const ItemScheme: Schema = new Schema({
  shape: { type: String, required: false },
  type: { type: String, required: false },
  boardId: { type: String, required: false },
  id: { type: String, required: true },
  createdAt: { type: String, required: true },
  createdBy: { type: Object, required: false },
  data: { type: Object, required: false },
  geometry: { type: Object, required: false },
  links: { type: Object, required: false },
  modifiedAt: { type: String, required: false },
  modifiedBy: { type: Object, required: false },
  position: { type: Object, required: false },
  style: { type: Object, required: false },
});

ItemScheme.index({ id: 1 }, { unique: true });
ItemScheme.index({ boardId: 1 }, { unique: false });

export default mongoose.models.Item !== undefined
  ? mongoose.models.Item
  : mongoose.model<Item>("Item", ItemScheme);
