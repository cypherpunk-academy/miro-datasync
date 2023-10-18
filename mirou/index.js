class Mirou {
  async modifyStyleOfSelection(style) {
    const selections = await miro.board.getSelection();
    for (const selection of selections) {
      selection.style = { ...selection.style, ...style };
      await selection.sync();
    }
  }

  async getShapes() {
    const items = await miro.board.get();
    const shapes = new Set(items.map((item) => item.shape));
    return shapes;
  }

  async getTypes() {
    const items = await miro.board.get();
    const types = new Set(items.map((item) => item.type));
    return types;
  }

  async getAllItems(props) {
    const items = await miro.board.get({ type: props.type });
    return items.filter((item) =>
      Object.keys(props).every((key) => item[key] === props[key])
    );
  }
}

class Dpdf {
  async getChapter(num) {
    return (await mirou.getAllItems({ shape: "star" })).find((item) =>
      item.content.includes(num)
    );
  }

  async getParagraphs(num) {
    const chapter = await this.getChapter(num);

    if (!chapter) {
      throw new Error(`I didnot find a chapter  ${num}`);
    }

    const paragraphs = [];
    for (const firstConnectorId of chapter.connectorIds) {
      const idsInParagraph = [chapter.id, firstConnectorId];
      const sentences = [];
      let nextConnectorId = firstConnectorId;

      while (true) {
        const connector = (await miro.board.get({ id: nextConnectorId }))[0];

        const sentenceId = !idsInParagraph.includes(connector.start.item)
          ? connector.start.item
          : connector.end.item;

        if (!sentenceId) {
          throw new Error(
            "I did not find a fitting sentence id. Maybe a loop?"
          );
        }

        idsInParagraph.push(sentenceId);

        const sentence = (await miro.board.get({ id: sentenceId }))[0];

        if (!sentence) {
          throw new Error("I did not find a fitting sentence. Maybe a loop?");
        }

        sentences.push(sentence);

        if (!sentenceId) {
          throw new Error("I did not find a fitting sentence. Maybe a loop?");
        }

        if (sentence.connectorIds.length < 2) {
          break;
        }

        nextConnectorId = sentence.connectorIds.find(
          (id) => !idsInParagraph.includes(id)
        );

        if (!nextConnectorId) {
          throw new Error(
            "I did not find a fitting connector id. Maybe a loop?"
          );
        }

        idsInParagraph.push(nextConnectorId);
      }

      if (sentences.length > 0) {
        paragraphs.push({
          nr: sentences[0].content.match(/\d+/)[0],
          sentences,
        });
      }
    }

    return paragraphs;
  }
}

mirou = new Mirou();
dpdf = new Dpdf();
