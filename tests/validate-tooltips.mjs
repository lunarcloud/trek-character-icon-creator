// Validate tooltip data structure
import { tooltipData } from '../js/tooltip-data.js';

console.log('🔍 Validating Tooltip Data Structure\n');

let totalTooltips = 0;
let errors = 0;

for (const [category, tooltips] of Object.entries(tooltipData)) {
    const count = Object.keys(tooltips).length;
    totalTooltips += count;
    console.log(`✓ ${category}: ${count} tooltips`);

    // Check for empty tooltips
    for (const [key, value] of Object.entries(tooltips)) {
        if (!value || value.trim() === '') {
            console.error(`  ✗ Empty tooltip for ${category}.${key}`);
            errors++;
        }
    }
}

console.log(`\n📊 Summary:`);
console.log(`  Total categories: ${Object.keys(tooltipData).length}`);
console.log(`  Total tooltips: ${totalTooltips}`);
console.log(`  Errors: ${errors}`);

if (errors === 0) {
    console.log('\n✅ All tooltips are valid!');
} else {
    console.log(`\n❌ Found ${errors} invalid tooltips`);
    process.exit(1);
}

// Sample some tooltips
console.log('\n📝 Sample Tooltips:');
console.log(`  Humanoid: "${tooltipData.bodyTypes.humanoid}"`);
console.log(`  Cetaceous: "${tooltipData.bodyTypes.cetaceous}"`);
console.log(`  Pointy ears: "${tooltipData.ears.pointy}"`);
console.log(`  Andorian antennae: "${tooltipData.headFeatures['andorian-antennae']}"`);
console.log(`  TOS uniform: "${tooltipData.uniformEras.TOS}"`);
console.log(`  Command department: "${tooltipData.departments.Command}"`);
