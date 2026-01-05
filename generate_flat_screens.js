const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = '/Users/ashok/.gemini/antigravity/brain/812bcc99-3ede-4b8c-b987-f7b1d032b403';

const SOURCE_IMAGES = [
    { file: 'flat_dashboard_1767572337784.png' }, // Note: timestamps will differ, need to find actual names
    { file: 'flat_add_drink_1767572351878.png' },
    { file: 'flat_analytics_1767572366525.png' }
];

const WIDTH = 1284;
const HEIGHT = 2778;

async function resizeScreenshot(sourceFile) {
    // Find the actual file since timestamp varies
    const files = fs.readdirSync(ARTIFACT_DIR);
    // Determine prefix based on sourceFile "base" name logic
    // Actually, I'll just pass the prefix to this function
    const prefix = sourceFile.split('_')[0] + '_' + sourceFile.split('_')[1]; // e.g., flat_dashboard

    const actualFile = files.find(f => f.startsWith(prefix) && f.endsWith('.png') && !f.startsWith('final_'));

    if (!actualFile) {
        console.log(`Could not find file starting with ${prefix}`);
        return;
    }

    const sourcePath = path.join(ARTIFACT_DIR, actualFile);
    const outputPath = path.join(ARTIFACT_DIR, `final_${actualFile}`);

    try {
        console.log(`Processing ${actualFile}...`);
        await sharp(sourcePath)
            .resize({
                width: WIDTH,
                height: HEIGHT,
                fit: 'cover' // Use cover for flat UI to fill screen without distortion
            })
            .toFile(outputPath);

        console.log(`Generated: ${outputPath}`);
    } catch (error) {
        console.error(`Error processing ${actualFile}:`, error);
    }
}

async function main() {
    console.log("Starting final flat resize...");
    const prefixes = ['flat_dashboard', 'flat_add_drink', 'flat_analytics'];

    // We search dir for these prefixes
    const files = fs.readdirSync(ARTIFACT_DIR);

    for (const prefix of prefixes) {
        const file = files.find(f => f.startsWith(prefix) && f.endsWith('.png') && !f.includes('final_'));
        if (file) {
            await resizeScreenshot(file);
        }
    }
    console.log("Done!");
}

main();
