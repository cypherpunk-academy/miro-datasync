import initMiro from "../../services/initMiro";
import { NextApiResponse } from "next";
import type { NextApiRequestWithMiro } from "../../types";
import Item from "../../models/item";
import Connector from "../../models/connector";
import { WidgetItem } from "@mirohq/miro-api/dist/highlevel/Item";
import { ConnectorWithLinks } from "@mirohq/miro-api/dist/api";

type ShapeItem = Extract<WidgetItem, { type: "shape" }>;
type StickyNoteItem = Extract<WidgetItem, { type: "stickyNote" }>;

const MAX_PARALLEL_REQUESTS = 50;

export default async function handler(
  req: NextApiRequestWithMiro,
  res: NextApiResponse
) {
  const { miro } = initMiro(req, res);
  const { boardId } = req.query;
  const api = miro.as("");

  const board = await api.getBoard(boardId as string);

  const [allItems, boardConnectors] = await Promise.all([
    board.getAllItems({}),
    board.getAllConnectors(),
  ]);

  const items: (ShapeItem | StickyNoteItem)[] = [];
  for await (const item of allItems) {
    if (item.type === "shape" || item.type === "sticky_note") {
      items.push(item as StickyNoteItem);
    }
  }

  const oneItem = await board.getItem(items[0].id);
  console.log(12.3, { oneItem });

  const styles = items.map((item) => item.style);

  console.log(12.31, { items });

  const connectors: ConnectorWithLinks[] = [];
  for await (const connector of boardConnectors) {
    connectors.push(connector);
  }

  while (items.length > 0) {
    const nextItems = items.splice(0, MAX_PARALLEL_REQUESTS);

    await Promise.all(
      nextItems.map((item) =>
        Item.updateOne(
          { id: item.id },
          {
            $set: {
              type: item.type,
              boardId: boardId,
              id: item.id,
              createdAt: item.createdAt,
              createdBy: item.createdBy,
              data: item.data,
              geometry: item.geometry,
              links: item.links,
              modifiedAt: item.modifiedAt,
              modifiedBy: item.modifiedBy,
              position: item.position,
              style: item.style,
            },
          },
          { upsert: true }
        )
      )
    );

    console.info(`Updated ${nextItems.length} items. ${items.length} left.`);
  }

  while (connectors.length > 0) {
    const nextConnectors = connectors.splice(0, MAX_PARALLEL_REQUESTS);

    await Promise.all(
      nextConnectors.map((connector) =>
        Connector.updateOne(
          { id: connector.id },
          {
            $set: {
              boardId: boardId,
              shape: connector.shape,
              createdAt: connector.createdAt,
              createdBy: connector.createdBy,
              endItem: connector.endItem,
              links: connector.links,
              modifiedAt: connector.modifiedAt,
              modifiedBy: connector.modifiedBy,
              startItem: connector.startItem,
              style: connector.style,
              type: connector.type,
            },
          },
          { upsert: true }
        )
      )
    );

    console.info(
      `Updated ${nextConnectors.length} connectors. ${connectors.length} left.`
    );
  }

  res.status(200).send("OK");
}
