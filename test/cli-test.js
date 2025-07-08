const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// CLI test configuration
const cliPath = path.join(__dirname, '../dist/bin/cli.js');
const inputFile = path.join(__dirname, 'index.html');
const outputDir = path.join(__dirname, 'output');

console.log('🧪 Starting comprehensive CLI tests...\n');

// Helper function to run CLI commands
function runCLICommand(args, description, expectPrompt = false) {
    return new Promise((resolve, reject) => {
        console.log(`🔄 ${description}`);
        console.log(`   Command: node ${cliPath} ${args.join(' ')}`);
        
        const child = spawn('node', [cliPath, ...args], {
            stdio: expectPrompt ? 'inherit' : 'pipe',
            cwd: __dirname
        });
        
        let output = '';
        let errorOutput = '';
        
        if (!expectPrompt) {
            child.stdout?.on('data', (data) => {
                output += data.toString();
            });
            
            child.stderr?.on('data', (data) => {
                errorOutput += data.toString();
            });
        }
        
        child.on('close', (code) => {
            if (!expectPrompt) {
                console.log(`   Output: ${output.trim()}`);
                if (errorOutput) {
                    console.log(`   Error: ${errorOutput.trim()}`);
                }
            }
            console.log(`   Exit code: ${code}\n`);
            resolve({ code, output, errorOutput });
        });
        
        child.on('error', (error) => {
            console.log(`   Error: ${error.message}\n`);
            reject(error);
        });
    });
}

// Test suite
async function runAllCLITests() {
    try {
        console.log('📋 CLI Test Plan:');
        console.log('1. Help and version commands');
        console.log('2. File generation tests (automated)');
        console.log('3. Interactive prompt tests (manual verification needed)\n');
        
        // ==== SECTION 1: Help and Version Commands ====
        console.log('📚 === HELP AND VERSION TESTS ===\n');
        
        await runCLICommand(['--help'], 'Testing --help flag');
        await runCLICommand(['-h'], 'Testing -h flag');
        await runCLICommand(['--version'], 'Testing --version flag');
        await runCLICommand(['-v'], 'Testing -v flag');
        
        // ==== SECTION 2: File Generation Tests (Automated) ====
        console.log('🔧 === FILE GENERATION TESTS (Automated) ===\n');
        
        // Test 1: Full minification with all arguments
        await runCLICommand([
            '-i', inputFile,
            '-o', path.join(outputDir, 'cli-full.min.html')
        ], 'CLI Test 1: Full minification (default CSS + JS minified)');
        
        // Test 2: No CSS minification
        await runCLICommand([
            '-i', inputFile,
            '-o', path.join(outputDir, 'cli-no-css.min.html'),
            '--no-css'
        ], 'CLI Test 2: No CSS minification');
        
        // Test 3: No JS minification
        await runCLICommand([
            '-i', inputFile,
            '-o', path.join(outputDir, 'cli-no-js.min.html'),
            '--no-js'
        ], 'CLI Test 3: No JS minification');
        
        // Test 4: No CSS and No JS minification
        await runCLICommand([
            '-i', inputFile,
            '-o', path.join(outputDir, 'cli-no-css-no-js.min.html'),
            '--no-css',
            '--no-js'
        ], 'CLI Test 4: No CSS and No JS minification');
        
        // Test 5: Bundle mode
        await runCLICommand([
            '-i', inputFile,
            '-o', path.join(outputDir, 'cli-bundle.min.html'),
            '--bundle'
        ], 'CLI Test 5: Bundle mode (no minification)');
        
        // Test 6: No verbose mode
        await runCLICommand([
            '-i', inputFile,
            '-o', path.join(outputDir, 'cli-no-verbose.min.html'),
            '--no-verbose'
        ], 'CLI Test 6: No verbose mode');
        
        // Test 7: Short flags combination
        await runCLICommand([
            '-i', inputFile,
            '-o', path.join(outputDir, 'cli-short-flags.min.html'),
            '-c', '-j', '-V'
        ], 'CLI Test 7: Short flags (-c -j -V)');
        
        // Test 8: Bundle with no verbose
        await runCLICommand([
            '-i', inputFile,
            '-o', path.join(outputDir, 'cli-bundle-quiet.min.html'),
            '--bundle',
            '--no-verbose'
        ], 'CLI Test 8: Bundle with no verbose');
        
        // ==== SECTION 3: Error Handling Tests ====
        console.log('❌ === ERROR HANDLING TESTS ===\n');
        
        // Test invalid options
        await runCLICommand([
            '--invalid-option'
        ], 'Error Test 1: Invalid option');
        
        // Test missing input file value
        await runCLICommand([
            '-i'
        ], 'Error Test 2: Missing input file value');
        
        // Test missing output file value
        await runCLICommand([
            '-i', inputFile,
            '-o'
        ], 'Error Test 3: Missing output file value');
        
        // ==== SECTION 4: Interactive Tests (Manual) ====
        console.log('🎯 === INTERACTIVE TESTS (Manual Verification Required) ===\n');
        console.log('The following tests require manual interaction:');
        console.log('- Press Ctrl+C to skip any interactive test');
        console.log('- Type "exit" to quit during prompts\n');
        
        // Test: No arguments (full interactive)
        console.log('📝 MANUAL TEST 1: No arguments (will prompt for everything)');
        console.log('   This will run the CLI with no arguments and prompt for input/output files');
        console.log('   You can test the interactive flow or press Ctrl+C to skip');
        await new Promise(resolve => {
            setTimeout(() => {
                console.log('   Starting interactive test in 3 seconds... (Press Ctrl+C to skip)');
                setTimeout(resolve, 3000);
            }, 1000);
        });
        
        try {
            await runCLICommand([], 'No arguments - full interactive mode', true);
        } catch (error) {
            console.log('   Interactive test skipped or interrupted\n');
        }
        
        // Test: Only input file specified
        console.log('📝 MANUAL TEST 2: Only input specified (will prompt for output)');
        console.log('   This will specify input but prompt for output file');
        console.log('   You can test this flow or press Ctrl+C to skip');
        await new Promise(resolve => {
            setTimeout(() => {
                console.log('   Starting test in 3 seconds... (Press Ctrl+C to skip)');
                setTimeout(resolve, 3000);
            }, 1000);
        });
        
        try {
            await runCLICommand([
                '-i', inputFile
            ], 'Only input specified - will prompt for output', true);
        } catch (error) {
            console.log('   Interactive test skipped or interrupted\n');
        }
        
        // Test: Full prompt mode
        console.log('📝 MANUAL TEST 3: Full prompt mode');
        console.log('   This will enable full prompt mode for minification options');
        console.log('   You can test this flow or press Ctrl+C to skip');
        await new Promise(resolve => {
            setTimeout(() => {
                console.log('   Starting test in 3 seconds... (Press Ctrl+C to skip)');
                setTimeout(resolve, 3000);
            }, 1000);
        });
        
        try {
            await runCLICommand([
                '-i', inputFile,
                '-o', path.join(outputDir, 'cli-full-prompt.min.html'),
                '--full-prompt'
            ], 'Full prompt mode - will ask for minification options', true);
        } catch (error) {
            console.log('   Interactive test skipped or interrupted\n');
        }
        
        // ==== RESULTS SUMMARY ====
        console.log('✅ === CLI TESTS COMPLETED ===\n');
        
        // List generated files
        console.log('📁 Generated CLI test files in output directory:');
        const outputFiles = fs.readdirSync(outputDir).filter(file => file.startsWith('cli-'));
        outputFiles.forEach(file => {
            console.log(`   ✓ ${file}`);
        });
        
        console.log('\n📋 Test Summary:');
        console.log('   ✅ Help and version commands tested');
        console.log('   ✅ File generation tests completed');
        console.log('   ✅ Error handling tests completed');
        console.log('   📝 Interactive tests available for manual verification');
        
        console.log('\n🔍 Files to verify:');
        console.log('   • Check each cli-*.min.html file for correct minification behavior');
        console.log('   • Compare with corresponding non-CLI test files');
        console.log('   • Verify error messages appeared correctly');
        
    } catch (error) {
        console.error('❌ Test suite failed:', error);
        process.exit(1);
    }
}

// Run the test suite
runAllCLITests();
