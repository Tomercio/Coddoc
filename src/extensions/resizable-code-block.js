import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Plugin, PluginKey } from "@tiptap/pm/state";

const resizableCodeBlockPluginKey = new PluginKey("resizableCodeBlock");

export const ResizableCodeBlock = CodeBlockLowlight.extend({
  name: "codeBlock",

  addOptions() {
    return {
      ...this.parent?.(),
      minHeight: 100,
      defaultHeight: "auto",
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      height: {
        default: this.options.defaultHeight,
        parseHTML: (el) => el.style.height || this.options.defaultHeight,
        renderHTML: (attrs) =>
          attrs.height ? { style: `height: ${attrs.height}` } : {},
      },
      language: {
        default: null,
        parseHTML: (el) => el.getAttribute("data-language"),
        renderHTML: (attrs) =>
          attrs.language ? { "data-language": attrs.language } : {},
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const { height } = HTMLAttributes;
    return [
      "div",
      {
        class: "code-block-wrapper",
        style: "position: relative; margin: 1rem 0;",
      },
      [
        "pre",
        {
          ...HTMLAttributes,
          class: "code-block",
          style: `height: ${height}; overflow-y: auto; position: relative; ${
            HTMLAttributes.style || ""
          }`,
        },
        [
          "code",
          {
            class: HTMLAttributes.language
              ? `language-${HTMLAttributes.language}`
              : undefined,
          },
          0,
        ],
      ],
      [
        "div",
        {
          class: "resize-handle-height",
          contenteditable: "false",
          style:
            "position: absolute; bottom: 0; width: 100%; height: 8px; cursor: ns-resize; text-align: center; opacity: 0; transition: opacity 0.2s;",
        },
        [
          "div",
          {
            style:
              "width: 40px; height: 3px; background-color: #6b7280; border-radius: 3px; display: inline-block; margin-bottom: 2px;",
          },
        ],
      ],
    ];
  },

  addProseMirrorPlugins() {
    const plugins = this.parent?.() || [];

    const resizePlugin = new Plugin({
      key: resizableCodeBlockPluginKey,
      props: {
        handleDOMEvents: {
          mousedown: (view, event) => {
            const isHandle =
              event.target.classList?.contains("resize-handle-height") ||
              event.target.parentElement?.classList?.contains(
                "resize-handle-height"
              );
            if (!isHandle) return false;

            event.preventDefault();
            const wrapper = event.target.closest(".code-block-wrapper");
            const codeEl = wrapper?.querySelector(".code-block");
            if (!wrapper || !codeEl) return false;

            const startY = event.clientY;
            const startH = codeEl.offsetHeight;
            const minH = this.options.minHeight;

            const onMouseMove = (e) => {
              const diff = e.clientY - startY;
              codeEl.style.height = `${Math.max(minH, startH + diff)}px`;
            };

            const onMouseUp = () => {
              document.removeEventListener("mousemove", onMouseMove);
              document.removeEventListener("mouseup", onMouseUp);

              // Persist the new height into the document model
              const { state, dispatch } = view;
              let pos = null;
              state.doc.descendants((node, p) => {
                if (pos != null) return false;
                if (node.type.name === "codeBlock") {
                  const dom = view.nodeDOM(p);
                  if (dom.contains(codeEl)) {
                    pos = p;
                    return false;
                  }
                }
                return true;
              });
              if (pos != null) {
                const node = state.doc.nodeAt(pos);
                const tr = state.tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  height: codeEl.style.height,
                });
                dispatch(tr);
              }
            };

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
            return true;
          },
        },
      },
    });

    return [...plugins, resizePlugin];
  },
});

export default ResizableCodeBlock;
