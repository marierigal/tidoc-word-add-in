/* global Word console */

export async function tagSelection(
  tag: string,
  type: string = Word.ContentControlType.richText,
  items: string[] = []
) {
  await Word.run(async (context) => {

    console.log({tag, type, items});

    const range = context.document.getSelection();
    const contentControl = range.insertContentControl(type as any);

    contentControl.tag = tag;
    contentControl.title = tag;

    if (type === Word.ContentControlType.dropDownList) {
      for (const item of items) {
        contentControl.dropDownListContentControl.addListItem(item)
      }
    } else if (type === Word.ContentControlType.checkBox) {
      contentControl.appearance = Word.ContentControlAppearance.hidden;
    }

    await context.sync();
  });
}

export async function checkTags() {
  await Word.run(async (context) => {
    const contentControls = context.document.contentControls;
    contentControls.load("items")
    await context.sync();
    for (const contentControl of contentControls.items) {
      contentControl.load("tag");
      await context.sync();
      console.log("Tag detected :", contentControl.isNullObject ? "none" : contentControl.tag);
    }
  });
}

export async function insertClientData(contentControlTag: string, client: { name: string; address: string; }) {
  await Word.run(async (context) => {
    const contentControls = context.document.contentControls.getByTag(contentControlTag);

    contentControls.load("items")
    await context.sync();

    for (let contentControl of contentControls.items) {
      const range = contentControl.getRange();

      // Search for each placeholder and replace it in place, so the paragraph
      // keeps its existing style (we're not deleting/recreating paragraphs)
      const placeholders: Record<string, string> = {
        "{{name}}": client.name, "{{address}}": client.address,
      };

      for (const [placeholder, value] of Object.entries(placeholders)) {
        const results = range.search(placeholder, { matchCase: true });
        results.load("items");
        await context.sync();

        results.items.forEach((found) => {
          found.insertText(value, Word.InsertLocation.replace);
        });
      }
    }
    await context.sync();
  });
}
