const CURRENT_DOCUMENT_KEY = "Coddoc_current_document";

// Saves the document to local storage
export const saveDocumentToLocalStorage = (document) => {
  try {
    const documentData = {
      id: document.id || "default",
      title: document.title || "File name",
      content: document.content || "",
      lastModified: new Date().toISOString(),
      codeTheme: document.codeTheme || "dark",
      imageStates: document.imageStates || {},
    };

    // Save to local storage
    localStorage.setItem(CURRENT_DOCUMENT_KEY, JSON.stringify(documentData));

    return true;
  } catch (error) {
    console.error("Error saving document to localStorage:", error);
    return false;
  }
};

export const loadDocumentFromLocalStorage = () => {
  try {
    const savedData = localStorage.getItem(CURRENT_DOCUMENT_KEY);

    if (!savedData) {
      return createDefaultDocument();
    }

    return JSON.parse(savedData);
  } catch (error) {
    console.error("Error loading document from localStorage:", error);
    return createDefaultDocument();
  }
};

// Creates a default document
export const createDefaultDocument = () => {
  return {
    id: "default",
    title: "File name",
    content: `<h1>Welcome to Coddoc</h1><p>This is a text editor with excellent code support!</p><p>Try adding a code block using the code button in the toolbar 👆</p>`,
    lastModified: new Date().toISOString(),
    codeTheme: "dark",
    imageStates: {},
  };
};

// Deletes the document from local storage
export const clearDocumentFromLocalStorage = () => {
  try {
    localStorage.removeItem(CURRENT_DOCUMENT_KEY);
    return true;
  } catch (error) {
    console.error("Error deleting document from localStorage:", error);
    return false;
  }
};

// Checks if there is a saved document
export const hasStoredDocument = () => {
  return localStorage.getItem(CURRENT_DOCUMENT_KEY) !== null;
};

// Updates information about image size
export const updateImageState = (imageId, imageState) => {
  try {
    const document = loadDocumentFromLocalStorage();

    if (!document.imageStates) {
      document.imageStates = {};
    }

    // Update image state
    document.imageStates[imageId] = imageState;

    // Save the updated document
    saveDocumentToLocalStorage(document);

    return true;
  } catch (error) {
    console.error("Error updating image state:", error);
    return false;
  }
};

// Automatically saves the document at regular intervals
export const setupAutoSave = (document, intervalMs = 3000) => {
  const intervalId = setInterval(() => {
    saveDocumentToLocalStorage(document);
  }, intervalMs);

  // Return the interval ID so it can be stopped later
  return intervalId;
};

// Stops the automatic save
export const stopAutoSave = (intervalId) => {
  if (intervalId) {
    clearInterval(intervalId);
  }
};
