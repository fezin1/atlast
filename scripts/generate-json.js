const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

function generateContentJSON() {
  const contentDir = path.join(__dirname, '../content');
  const output = [];
  
  console.log('Starting JSON generation...');
  
  // Process problems
  const problemsDir = path.join(contentDir, 'problems');
  if (fs.existsSync(problemsDir)) {
    console.log('Processing problems...');
    processDirectory(problemsDir, 'problem', output);
  }
  
  // Process strategies
  const strategiesDir = path.join(contentDir, 'strategies');
  if (fs.existsSync(strategiesDir)) {
    console.log('Processing strategies...');
    processDirectory(strategiesDir, 'strategy', output);
  }
  
  // Process weekly challenges
  const weeklyDir = path.join(contentDir, 'weekly');
  if (fs.existsSync(weeklyDir)) {
    console.log('Processing weekly challenges...');
    processDirectory(weeklyDir, 'weekly', output);
  }
  
  // Create data directory if it doesn't exist
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
  
  // Save to data.json
  fs.writeFileSync(
    path.join(dataDir, 'data.json'),
    JSON.stringify(output, null, 2)
  );
  
  console.log(`✅ Generated ${output.length} items in data.json`);
}

function processDirectory(dirPath, type, outputArray) {
  try {
    console.log(`\n📁 Scanning directory: ${dirPath}`);
    
    // Check if directory exists first
    if (!fs.existsSync(dirPath)) {
      console.log(`⚠️  Directory not found: ${dirPath}`);
      return;
    }
    
    const items = fs.readdirSync(dirPath, { recursive: true, withFileTypes: true });
    
    console.log(`🔍 Found ${items.length} items total in ${path.basename(dirPath)}`);
    
    let mdFileCount = 0;
    let otherItems = 0;
    
    for (const item of items) {
      if (item.isFile() && item.name.endsWith('.md')) {
        mdFileCount++;
        const filePath = path.join(item.path, item.name);
        
        // Debug: show what we found
        console.log(`📄 Found markdown: ${filePath}`);
        
        if (!fs.existsSync(filePath)) {
          console.log(`⚠️  File not found, skipping: ${filePath}`);
          continue;
        }
        
        try {
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const { data: frontmatter, content } = matter(fileContent);
          
          let statement = content;
          let solution = '';
          
          if (content.includes('## Solution')) {
            statement = content.split('## Solution')[0].trim();
            solution = content.split('## Solution')[1].trim();
          }
          
          statement = statement.replace('## Problem Statement', '').trim();
          
          outputArray.push({
            type,
            ...frontmatter,
            statement,
            solution: solution || ''
          });
          
          console.log(`✅ Processed: ${item.name}`);
          
        } catch (fileError) {
          console.error(`❌ Error processing ${filePath}:`, fileError.message);
        }
      } else {
        otherItems++;
        // Uncomment to see all items found:
        // console.log(`📂 Other item: ${item.name} (${item.isFile() ? 'file' : 'directory'})`);
      }
    }
    
    console.log(`📊 Results: ${mdFileCount} markdown files, ${otherItems} other items`);
    
  } catch (error) {
    console.error(`❌ Error processing directory ${dirPath}:`, error.message);
  }
}

// Run if called directly
if (require.main === module) {
  generateContentJSON();
}

module.exports = { generateContentJSON };