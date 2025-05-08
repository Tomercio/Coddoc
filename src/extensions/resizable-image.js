import { Node, mergeAttributes } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

const resizableImagePluginKey = new PluginKey("resizableImage");

export const ResizableImage = Node.create({
  name: "resizableImage",

  group: "block",

  inline: false,

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: "100%",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="resizable-image"]',
        getAttrs: (node) => {
          const img = node.querySelector("img");
          return {
            src: img?.getAttribute("src"),
            alt: img?.getAttribute("alt"),
            title: img?.getAttribute("title"),
            width: node.style.width,
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, alt, title, width } = HTMLAttributes;

    return [
      "div",
      {
        "data-type": "resizable-image",
        style: `width: ${width}; position: relative;`,
      },
      [
        "img",
        {
          src,
          alt,
          title,
          style: "display: block; width: 100%; height: auto; max-width: 100%;",
        },
      ],
      [
        "div",
        {
          class: "resize-handle",
          style:
            "position: absolute; bottom: 3px; right: 3px; width: 12px; height: 12px; background-color: #1e88e5; cursor: se-resize; border-radius: 2px; z-index: 10;",
        },
      ],
    ];
  },

  addCommands() {
    return {
      insertResizableImage:
        (options) =>
        ({ tr, dispatch }) => {
          const { type } = this;

          if (dispatch) {
            const node = type.create(options);
            tr.replaceSelectionWith(node);
          }

          return true;
        },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: resizableImagePluginKey,
        props: {
          handleDOMEvents: {
            mousedown(view, event) {
              if (!event.target.classList?.contains("resize-handle")) {
                return false;
              }

              event.preventDefault();

              const container = event.target.parentElement;
              if (
                !container ||
                container.getAttribute("data-type") !== "resizable-image"
              ) {
                return false;
              }

              const parentWidth = container.parentElement.clientWidth;
              const startWidth = container.clientWidth;
              const startX = event.clientX;

              const mouseMoveHandler = (moveEvent) => {
                const currentX = moveEvent.clientX;
                const diffX = currentX - startX;

                const newWidth = Math.max(
                  30,
                  Math.min(parentWidth, startWidth + diffX)
                );
                const newWidthPercent = (newWidth / parentWidth) * 100;

                container.style.width = `${newWidthPercent}%`;
              };

              const mouseUpHandler = () => {
                document.removeEventListener("mousemove", mouseMoveHandler);
                document.removeEventListener("mouseup", mouseUpHandler);

                const finalWidth = container.style.width;

                const { doc, tr } = view.state;
                let targetPos = null;

                doc.descendants((node, pos) => {
                  if (targetPos !== null) return false;

                  if (node.type.name === "resizableImage") {
                    const domNode = view.nodeDOM(pos);
                    if (domNode && domNode === container) {
                      targetPos = pos;
                      return false;
                    }
                  }

                  return true;
                });

                if (targetPos !== null) {
                  const node = doc.nodeAt(targetPos);

                  const transaction = tr.setNodeMarkup(targetPos, undefined, {
                    ...node.attrs,
                    width: finalWidth,
                  });

                  view.dispatch(transaction);
                }
              };

              document.addEventListener("mousemove", mouseMoveHandler);
              document.addEventListener("mouseup", mouseUpHandler);

              return true;
            },
          },
        },
      }),
    ];
  },
});

export default ResizableImage;
