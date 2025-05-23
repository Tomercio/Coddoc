Coddoc
A rich, PDF-focused text and code editor built with React and TipTap—perfect for developers creating assignments, documentation, and reports with live code blocks.

Features
WYSIWYG Rich Text: Headings, lists, blockquotes, horizontal rules, links, and more.

Code Blocks: Syntax-highlighted code blocks with lowlight (supports JavaScript, Python, Java, etc.), theming, and optional line numbers.

Resizable Images: Drag-to-resize images right in the editor.

Font Styling: Bold, italic, underline, strikethrough, text color, font family, and font size controls.

Text Alignment: Left, center, and right alignment.

Sticky Toolbar: Always visible while you scroll through long documents.

Auto-Save & Manual Save: Drafts persisted to localStorage every 5 seconds, plus a manual save button with timestamp.

Export to PDF: High-quality, multipage PDF export (handles large documents gracefully).

Theme Picker: Light, Dark, and Desert color schemes for the entire app.

Responsive Design: Mobile and tablet–friendly layout; header adapts to any screen width.

📦 Installation
Clone the repo

bash
Copy
Edit
git clone https://github.com/your-org/coddoc.git
cd coddoc
Install dependencies

bash
Copy
Edit
npm install

# or

yarn
Run in development

bash
Copy
Edit
npm run dev

# or

yarn dev
The app will be available at http://localhost:3000.

🚀 Usage
Create & edit

Type your document in the editor.

Use the toolbar to add styling, code blocks, images, and more.

Auto-save & manual save

Drafts auto-save every 5 seconds.

Click the 💾 Save icon to persist immediately.

Change theme

Click the 🎨 Theme button in the header.

Choose Light, Dark, or Desert.

Export to PDF

Click Export to PDF.

The generated PDF will download, preserving page breaks.

🛠 Configuration
Theme persistence
Stored in localStorage under coddoc-theme.

Document storage
Uses localStorage key Coddoc_current_document.

Auto-save interval
Default: every 5 seconds. To adjust, modify setupAutoSave(...) in App.jsx.
🤝 Contributing
Fork the repo

Create your feature branch (git checkout -b feat/my-feature)

Commit your changes (git commit -m "feat: add my feature")

Push to your branch (git push origin feat/my-feature)

Open a Pull Request

📝 License
MIT © [Your Name or Organization]

Enjoy using Coddoc—where writing and coding seamlessly come together!
