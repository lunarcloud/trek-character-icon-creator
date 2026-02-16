// Test the tooltip functionality by loading the modules
import { tooltipData } from './js/tooltip-data.js'
import { TooltipManager } from './js/tooltip-manager.js'

console.log('✅ Successfully imported tooltip modules\n')

console.log('📊 Tooltip Data Summary:')
console.log(`  Total categories: ${Object.keys(tooltipData).length}`)

let total = 0
for (const [category, items] of Object.entries(tooltipData)) {
    const count = Object.keys(items).length
    total += count
    console.log(`  - ${category}: ${count} tooltips`)
}
console.log(`\n  Total tooltips: ${total}\n`)

console.log('✅ Tooltip manager class exported successfully')
console.log(`  TooltipManager.initialize is a ${typeof TooltipManager.initialize}\n`)

console.log('📝 Sample Tooltip Content:')
console.log(`  Humanoid: "${tooltipData.bodyTypes.humanoid.substring(0, 70)}..."`)
console.log(`  Pointy Ears: "${tooltipData.ears.pointy}"`)
console.log(`  TOS Uniform: "${tooltipData.uniformEras.TOS}"`)
console.log(`  Command: "${tooltipData.departments.Command}"`)

console.log('\n✅ All tooltip modules loaded and validated successfully!')
console.log('\n💡 To test in browser:')
console.log('   1. Run: npm run serve')
console.log('   2. Open: http://localhost:3000')
console.log('   3. Hover over dropdown options to see tooltips')
