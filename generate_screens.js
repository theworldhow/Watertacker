const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = '/Users/ashok/.gemini/antigravity/brain/46664ce0-4400-41a1-b2a6-9571b0b3506d';

const SOURCE_IMAGES = [
    { file: 'screenshot_dashboard_1767572337784.png' },
    { file: 'screenshot_add_drink_1767572351878.png' },
    { file: 'screenshot_analytics_1767572366525.png' }
];

const WIDTH = 1284;
const HEIGHT = 2778;

async function resizeScreenshot(config) {
    const sourcePath = path.join(ARTIFACT_DIR, config.file);
    const outputPath = path.join(ARTIFACT_DIR, `raw_resized_${config.file}`);

    try {
        console.log(`Processing ${config.file}...`);
        await sharp(sourcePath)
            .resize({
                width: WIDTH,
                height: HEIGHT,
                fit: 'fill' // Force exact dimensions
            })
            .toFile(outputPath);

        console.log(`Generated: ${outputPath}`);
    } catch (error) {
        console.error(`Error processing ${config.file}:`, error);
    }
}

async function main() {
    console.log("Starting raw resize generation...");
    for (const config of SOURCE_IMAGES) {
        await resizeScreenshot(config);
    }
    console.log("Done!");
}

main();
