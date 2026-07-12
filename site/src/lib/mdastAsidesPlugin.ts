import { defineMdastPlugin } from "satteri";
import type { Paragraph } from "mdast";
import type { Data, Properties } from "hast";

    // return {
    //   type: "paragraph",
    //   data: { hName: tagName, hProperties: properties },
    //   children: children,
    // }

export const asidesPlugin = defineMdastPlugin({
  name: "asides",
  containerDirective(node, ctx): Paragraph {
    return {
      type: "paragraph",
      data: {
        hName: "aside",
        hProperties: {
          "aria-label": `aside.note`,
          class: `aside aside-note`,
        } as Properties,
      },
      children: [
        {
          type: "paragraph",
          data: {
            hName: "p",
            hProperties: {
              class: "aside aside-title",
              // "aria-hidden": "true",
            },
          },
          children: [
            // iconNode
            // ...titleNode
          ],
        },
        {
          type: "paragraph",
          data: {
            hName: "div",
            hProperties: {
              class: "aside aside-content",
            },
          },
          // children: children,
        }
      ] as Paragraph["children"],
    }
  }
});
