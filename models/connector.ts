import {
  Caption,
  ConnectorStyle,
  UserInfoShort,
  SelfLink,
  ItemConnectionWithLinks,
} from "@mirohq/miro-api/dist/api";
import mongoose, { Schema } from "mongoose";

export interface Connector {
  type: string;
  shape: string;
  boardId: string;
  id: string;
  captions: Caption[];
  createdAt: string;
  createdBy: UserInfoShort;
  endItem: ItemConnectionWithLinks;
  isSupported?: boolean;
  links: SelfLink;
  modifiedAt: string;
  modifiedBy: UserInfoShort;
  startItem: ItemConnectionWithLinks;
  style: ConnectorStyle;
}

const ConnectorScheme: Schema = new Schema({
  type: { type: String, required: false },
  shape: { type: String, required: false },
  boardId: { type: String, required: false },
  id: { type: String, required: false },
  captions: { type: Object, required: false },
  createdAt: { type: String, required: false },
  createdBy: { type: Object, required: false },
  endItem: { type: Object, required: false },
  isSupported: { type: String, required: false },
  links: { type: Object, required: false },
  modifiedAt: { type: String, required: false },
  modifiedBy: { type: Object, required: false },
  startItem: { type: Object, required: false },
  style: { type: Object, required: false },
});

ConnectorScheme.index({ id: 1 }, { unique: true });
ConnectorScheme.index({ boardId: 1 }, { unique: false });

export default mongoose.models.Connector !== undefined
  ? mongoose.models.Connector
  : mongoose.model<Connector>("Connector", ConnectorScheme);
