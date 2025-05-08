import React, { useState } from "react";
import { SketchPicker } from "react-color";
import { cn } from "../../lib/utils";

const colorGroups = {
  basic: [
    { color: "#000000", name: "Black" },
    { color: "#FFFFFF", name: "White" },
    { color: "#808080", name: "Gray" },
    { color: "#C0C0C0", name: "Silver" },
    { color: "#800000", name: "Maroon" },
    { color: "#FF0000", name: "Red" },
    { color: "#800080", name: "Purple" },
    { color: "#FF00FF", name: "Magenta" },
    { color: "#008000", name: "Dark Green" },
    { color: "#00FF00", name: "Lime" },
    { color: "#808000", name: "Olive" },
    { color: "#FFFF00", name: "Yellow" },
    { color: "#000080", name: "Navy Blue" },
    { color: "#0000FF", name: "Blue" },
    { color: "#008080", name: "Dark Cyan" },
    { color: "#00FFFF", name: "Cyan" },
  ],
  redShades: [
    { color: "#FFE4E1", name: "Light Pink" },
    { color: "#FFC0CB", name: "Pink" },
    { color: "#FF69B4", name: "Hot Pink" },
    { color: "#FF1493", name: "Deep Pink" },
    { color: "#DB7093", name: "Pale Violet Red" },
    { color: "#C71585", name: "Medium Violet Red" },
    { color: "#FF0000", name: "Red" },
    { color: "#DC143C", name: "Crimson" },
    { color: "#B22222", name: "Firebrick" },
    { color: "#A52A2A", name: "Brown" },
    { color: "#8B0000", name: "Dark Red" },
  ],
  orangeBrownShades: [
    { color: "#FFA07A", name: "Light Salmon" },
    { color: "#FF7F50", name: "Coral" },
    { color: "#FF6347", name: "Tomato" },
    { color: "#FF4500", name: "Orange Red" },
    { color: "#FFA500", name: "Orange" },
    { color: "#FF8C00", name: "Dark Orange" },
    { color: "#DAA520", name: "Goldenrod" },
    { color: "#B8860B", name: "Dark Goldenrod" },
    { color: "#CD853F", name: "Peru" },
    { color: "#D2691E", name: "Chocolate" },
    { color: "#8B4513", name: "Saddle Brown" },
    { color: "#A0522D", name: "Sienna" },
  ],
  yellowGreenShades: [
    { color: "#FFFF00", name: "Yellow" },
    { color: "#FFFFE0", name: "Light Yellow" },
    { color: "#FFFACD", name: "Lemon Chiffon" },
    { color: "#F0E68C", name: "Khaki" },
    { color: "#EEE8AA", name: "Pale Goldenrod" },
    { color: "#BDB76B", name: "Dark Khaki" },
    { color: "#ADFF2F", name: "Green Yellow" },
    { color: "#7FFF00", name: "Chartreuse" },
    { color: "#7CFC00", name: "Lawn Green" },
    { color: "#00FF00", name: "Lime" },
    { color: "#32CD32", name: "Lime Green" },
    { color: "#00FF7F", name: "Spring Green" },
    { color: "#008000", name: "Green" },
    { color: "#006400", name: "Dark Green" },
  ],
  blueShades: [
    { color: "#E0FFFF", name: "Light Cyan" },
    { color: "#00FFFF", name: "Aqua" },
    { color: "#00CED1", name: "Dark Turquoise" },
    { color: "#40E0D0", name: "Turquoise" },
    { color: "#48D1CC", name: "Medium Turquoise" },
    { color: "#20B2AA", name: "Light Sea Green" },
    { color: "#008B8B", name: "Dark Cyan" },
    { color: "#008080", name: "Teal" },
    { color: "#7FFFD4", name: "Aquamarine" },
    { color: "#66CDAA", name: "Medium Aquamarine" },
    { color: "#5F9EA0", name: "Cadet Blue" },
    { color: "#4682B4", name: "Steel Blue" },
    { color: "#0000FF", name: "Blue" },
    { color: "#0000CD", name: "Medium Blue" },
    { color: "#00008B", name: "Dark Blue" },
    { color: "#000080", name: "Navy" },
  ],
  purpleShades: [
    { color: "#E6E6FA", name: "Lavender" },
    { color: "#D8BFD8", name: "Thistle" },
    { color: "#DDA0DD", name: "Plum" },
    { color: "#DA70D6", name: "Orchid" },
    { color: "#EE82EE", name: "Violet" },
    { color: "#FF00FF", name: "Fuchsia" },
    { color: "#BA55D3", name: "Medium Orchid" },
    { color: "#9370DB", name: "Medium Purple" },
    { color: "#8A2BE2", name: "Blue Violet" },
    { color: "#9400D3", name: "Dark Violet" },
    { color: "#9932CC", name: "Dark Orchid" },
    { color: "#8B008B", name: "Dark Magenta" },
    { color: "#800080", name: "Purple" },
    { color: "#4B0082", name: "Indigo" },
  ],
  grayShades: [
    { color: "#F8F8FF", name: "Ghost White" },
    { color: "#F5F5F5", name: "White Smoke" },
    { color: "#DCDCDC", name: "Gainsboro" },
    { color: "#D3D3D3", name: "Light Gray" },
    { color: "#C0C0C0", name: "Silver" },
    { color: "#A9A9A9", name: "Dark Gray" },
    { color: "#808080", name: "Gray" },
    { color: "#696969", name: "Dim Gray" },
    { color: "#778899", name: "Light Slate Gray" },
    { color: "#708090", name: "Slate Gray" },
    { color: "#2F4F4F", name: "Dark Slate Gray" },
  ],
  special: [
    { color: "#FFD700", name: "Gold" },
    { color: "#C0C0C0", name: "Silver" },
    { color: "#B87333", name: "Copper" },
    { color: "#CD7F32", name: "Bronze" },
    { color: "#FFC0CB", name: "Pink" },
    { color: "#00FF7F", name: "Mint" },
    { color: "#FF7F50", name: "Coral" },
    { color: "#FFFACD", name: "Lemon Chiffon" },
    { color: "#FFF8DC", name: "Ivory" },
    { color: "#F5DEB3", name: "Wheat" },
    { color: "#F0F8FF", name: "Alice Blue" },
    { color: "#F0FFFF", name: "Azure" },
  ],
};

// Advanced color picker component
const ColorPicker = ({ onSelectColor, onClose }) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [customColor, setCustomColor] = useState("#000000");
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  // Select a predefined color
  const handleColorSelect = (color) => {
    onSelectColor(color);
    onClose?.();
  };

  // Update custom color state
  const handleCustomColorChange = (color) => {
    setCustomColor(color.hex);
  };

  // Confirm custom color selection
  const handleCustomColorSelect = () => {
    onSelectColor(customColor);
    onClose?.();
  };

  return (
    <div className="absolute top-full right-0 mt-1 p-2 bg-white dark:bg-zinc-900 rounded-md shadow-lg border border-gray-200 dark:border-zinc-700 z-50 w-64">
      {/* Category tabs */}
      <div className="flex overflow-x-auto mb-2 pb-1 border-b border-gray-200 dark:border-zinc-700">
        {Object.keys(colorGroups).map((category) => (
          <button
            key={category}
            className={cn(
              "px-2 py-1 text-xs whitespace-nowrap",
              activeTab === category
                ? "border-b-2 border-primary text-primary"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            )}
            onClick={() => {
              setActiveTab(category);
              setShowCustomPicker(false);
            }}
          >
            {category
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
          </button>
        ))}
        <button
          className={cn(
            "px-2 py-1 text-xs whitespace-nowrap",
            activeTab === "custom"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          )}
          onClick={() => {
            setActiveTab("custom");
            setShowCustomPicker(true);
          }}
        >
          Custom Color
        </button>
      </div>

      {/* Color grid or custom picker */}
      {activeTab !== "custom" ? (
        <div className="grid grid-cols-4 gap-1">
          {colorGroups[activeTab].map((colorObj) => (
            <button
              key={colorObj.color}
              className="w-full h-8 rounded-md overflow-hidden border border-gray-300 dark:border-zinc-600 hover:border-gray-400 dark:hover:border-zinc-500 transition-colors"
              style={{ backgroundColor: colorObj.color }}
              title={colorObj.name}
              onClick={() => handleColorSelect(colorObj.color)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {showCustomPicker ? (
            <>
              <SketchPicker
                color={customColor}
                onChange={handleCustomColorChange}
                width="100%"
                presetColors={[
                  "#D0021B",
                  "#F5A623",
                  "#F8E71C",
                  "#8B572A",
                  "#7ED321",
                  "#417505",
                  "#BD10E0",
                  "#9013FE",
                  "#4A90E2",
                  "#50E3C2",
                  "#B8E986",
                  "#000000",
                  "#4A4A4A",
                  "#9B9B9B",
                  "#FFFFFF",
                ]}
              />
              <button
                className="text-sm py-1 px-3 bg-primary text-white rounded-md mt-2 hover:bg-primary/90"
                onClick={handleCustomColorSelect}
              >
                Select Color
              </button>
            </>
          ) : (
            <button
              className="text-sm py-1 px-3 bg-primary text-white rounded-md"
              onClick={() => setShowCustomPicker(true)}
            >
              Open Color Picker
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
