import { VoterCardData } from "./types";
import { CANVAS_WIDTH, CANVAS_HEIGHT, POTATO_IMAGES } from "./constants";

/**
 * Draws a placeholder potato when the image fails to load.
 * A simple brown circle with emoji text fallback.
 */
function drawPotatoPlaceholder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
): void {
  // Draw brown circle
  ctx.fillStyle = "#8B4513";
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();

  // Draw emoji text as fallback
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 100px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🥔", x + size / 2, y + size / 2);
}

/**
 * Loads an image with a fallback handler.
 * Returns true if loaded successfully, false otherwise.
 */
function loadImageWithFallback(
  img: HTMLImageElement,
  timeout: number = 5000
): Promise<boolean> {
  return new Promise((resolve) => {
    let loaded = false;

    const timeoutId = setTimeout(() => {
      if (!loaded) {
        resolve(false);
      }
    }, timeout);

    img.onload = () => {
      loaded = true;
      clearTimeout(timeoutId);
      resolve(true);
    };

    img.onerror = () => {
      loaded = true;
      clearTimeout(timeoutId);
      resolve(false);
    };

    // Trigger the load
    if (img.src) {
      // If src is already set, it might be cached
      if (img.complete) {
        loaded = true;
        clearTimeout(timeoutId);
        resolve(true);
      }
    }
  });
}

/**
 * The core drawing engine with comprehensive error handling.
 * @param canvas - The HTML5 Canvas reference
 * @param data - The state containing names, titles, and votes
 * @throws Error with user-friendly message if canvas doesn't support 2D context
 */
export async function drawCard(
  canvas: HTMLCanvasElement,
  data: VoterCardData
): Promise<void> {
  try {
    const ctx = canvas.getContext("2d");

    // Check if canvas context is available
    if (!ctx) {
      throw new Error(
        "Your browser doesn't support canvas rendering. Please use a modern browser like Chrome, Firefox, Safari, or Edge."
      );
    }

    // 1. Clear and Set Dimensions
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // 2. Background Layer
    ctx.fillStyle = "#FDFCF0"; // Creamy potato-ish white
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 3. Load Potato Asset with fallback
    const potatoImg = new Image();
    // Convert 1-based index to 0-based array index, with bounds checking
    const arrayIndex = Math.max(0, Math.min(data.potatoIndex - 1, POTATO_IMAGES.length - 1));
    potatoImg.src = POTATO_IMAGES[arrayIndex];

    const imageLoaded = await loadImageWithFallback(potatoImg);

    // Draw Potato (Top Centered)
    const imgSize = 400;
    const potatoX = CANVAS_WIDTH / 2 - imgSize / 2;
    const potatoY = 150;

    if (imageLoaded) {
      ctx.drawImage(potatoImg, potatoX, potatoY, imgSize, imgSize);
    } else {
      // Draw placeholder when image fails to load
      drawPotatoPlaceholder(ctx, potatoX, potatoY, imgSize);
    }

    // 4. Main Card Container (The "Paper")
    const margin = 60;
    ctx.fillStyle = "#FFFFFF";
    ctx.shadowBlur = 40;
    ctx.shadowColor = "rgba(0,0,0,0.05)";
    ctx.beginPath();
    ctx.roundRect(margin, 600, CANVAS_WIDTH - margin * 2, 1100, 40);
    ctx.fill();
    ctx.shadowBlur = 0; // Reset shadow for text

    // 5. Header Text
    ctx.textAlign = "center";
    ctx.fillStyle = "#1A1A1A";
    ctx.font = "bold 60px sans-serif";
    ctx.fillText(data.electionTitle || "2024 VOTER GUIDE", CANVAS_WIDTH / 2, 720);

    ctx.font = "400 35px sans-serif";
    ctx.fillStyle = "#666666";
    ctx.fillText(
      data.name ? `By ${data.name}` : "My Official Ballot",
      CANVAS_WIDTH / 2,
      780
    );

    // 6. Draw the Rows
    let currentY = 880;
    ctx.textAlign = "left";

    data.rows.forEach((row) => {
      if (!row.position && !row.decision) return;

      ctx.font = "bold 32px sans-serif";
      ctx.fillStyle = "#8B4513"; // Potato Brown
      ctx.fillText(row.position.toUpperCase(), margin + 60, currentY);

      ctx.font = "500 45px sans-serif";
      ctx.fillStyle = "#1A1A1A";
      ctx.fillText(row.decision, margin + 60, currentY + 60);

      // Divider Line
      ctx.strokeStyle = "#EEEEEE";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(margin + 60, currentY + 100);
      ctx.lineTo(CANVAS_WIDTH - margin - 60, currentY + 100);
      ctx.stroke();

      currentY += 160;
    });

    // 7. Footer Branding
    ctx.textAlign = "center";
    ctx.font = "bold 40px sans-serif";
    ctx.fillStyle = "#D4D4D4";
    ctx.fillText("POTATOVOTES.COM", CANVAS_WIDTH / 2, 1820);
  } catch (error) {
    // Re-throw with context for the component to handle
    if (error instanceof Error) {
      throw new Error(`Failed to generate card: ${error.message}`);
    }
    throw new Error("Failed to generate card: An unexpected error occurred");
  }
}
