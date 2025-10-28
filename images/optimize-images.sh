#!/bin/bash

# Aurora Template - Professional Image Optimization Script
# This script helps optimize and prepare professional images for the Aurora template

echo "🎨 Aurora Template - Professional Image Optimization"
echo "=================================================="

# Create images directory if it doesn't exist
mkdir -p images/optimized
mkdir -p images/originals

echo "📁 Directory structure created:"
echo "   - images/originals/ (for source images)"
echo "   - images/optimized/ (for web-optimized images)"

# Function to optimize images (requires ImageMagick)
optimize_image() {
    local input_file="$1"
    local output_file="$2"
    local width="$3"
    local quality="${4:-80}"
    
    if command -v convert &> /dev/null; then
        convert "$input_file" -resize "${width}x" -quality "$quality" -strip "$output_file"
        echo "✅ Optimized: $output_file"
    else
        echo "⚠️  ImageMagick not found. Please install it to auto-optimize images."
        echo "   For now, manually resize images to the specified dimensions."
    fi
}

echo ""
echo "🖼️  Required Professional Images:"
echo ""
echo "HERO SECTION IMAGES:"
echo "- hero-main.jpg (1200x800) - Professional workspace/team"
echo "- hero-mobile.jpg (800x600) - Mobile-optimized version"
echo ""
echo "PORTFOLIO IMAGES:"
echo "- project-dashboard.jpg (1200x800) + thumbnail (600x400)"
echo "- project-mobile.jpg (1200x800) + thumbnail (600x400)"  
echo "- project-website.jpg (1200x800) + thumbnail (600x400)"
echo "- project-analytics.jpg (1200x800) + thumbnail (600x400)"
echo ""
echo "CLIENT TESTIMONIALS:"
echo "- client-sarah.jpg (150x150) - Professional headshot"
echo "- client-michael.jpg (150x150) - Professional headshot"
echo "- client-david.jpg (150x150) - Professional headshot"
echo ""
echo "SOCIAL/META IMAGES:"
echo "- og-image.jpg (1200x630) - Open Graph social sharing"
echo "- twitter-card.jpg (1200x630) - Twitter Card image"
echo "- video-poster.jpg (800x450) - Video thumbnail"
echo ""

# Check if images directory has any files
if [ "$(ls -A images/originals 2>/dev/null)" ]; then
    echo "📸 Found images in originals directory. Processing..."
    
    # Process portfolio images
    for img in images/originals/project-*.jpg; do
        if [ -f "$img" ]; then
            filename=$(basename "$img" .jpg)
            optimize_image "$img" "images/optimized/${filename}.jpg" 1200 80
            optimize_image "$img" "images/optimized/${filename}-thumb.jpg" 600 80
        fi
    done
    
    # Process client images
    for img in images/originals/client-*.jpg; do
        if [ -f "$img" ]; then
            filename=$(basename "$img" .jpg)
            optimize_image "$img" "images/optimized/${filename}.jpg" 150 85
        fi
    done
    
    # Process other images
    if [ -f "images/originals/hero-main.jpg" ]; then
        optimize_image "images/originals/hero-main.jpg" "images/optimized/hero-main.jpg" 1200 80
    fi
    
    if [ -f "images/originals/og-image.jpg" ]; then
        optimize_image "images/originals/og-image.jpg" "images/optimized/og-image.jpg" 1200 80
    fi
else
    echo "📂 No images found in originals directory."
    echo ""
    echo "🎯 RECOMMENDED PROFESSIONAL IMAGE SOURCES:"
    echo ""
    echo "FREE SOURCES:"
    echo "- Unsplash Business Collection (unsplash.com/collections/business)"
    echo "- Pexels Business Photos (pexels.com/search/business/)"
    echo "- StockVault Professional (stockvault.net)"
    echo ""
    echo "PREMIUM SOURCES:"
    echo "- Adobe Stock Business Collection"
    echo "- Getty Images Professional"
    echo "- Shutterstock Corporate"
    echo ""
    echo "AI-GENERATED OPTIONS:"
    echo "- Midjourney (professional business imagery)"
    echo "- DALL-E 3 (custom business graphics)"
    echo "- Stable Diffusion (tailored business content)"
    echo ""
fi

echo ""
echo "🔧 NEXT STEPS:"
echo "1. Add your professional images to images/originals/"
echo "2. Run this script again to optimize them"
echo "3. Update HTML file paths from 'https://images.unsplash.com/...' to 'images/optimized/...'"
echo "4. Test all images load correctly"
echo "5. Verify images look professional on all devices"
echo ""
echo "💡 PRO TIPS:"
echo "- Use consistent lighting and style across all images"
echo "- Ensure people in photos look professional and friendly"
echo "- Optimize alt text for accessibility and SEO"
echo "- Test loading performance with optimized images"
echo ""

# Create a sample HTML update guide
cat > images/HTML_UPDATE_GUIDE.md << 'EOF'
# Aurora Template - Image Path Updates

## Current Unsplash URLs to Replace:

### Meta Images
```html
<!-- REPLACE THIS -->
<meta property="og:image" content="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?...">

<!-- WITH THIS -->
<meta property="og:image" content="images/optimized/og-image.jpg">
```

### Portfolio Images
```html
<!-- REPLACE THIS -->
<img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?..." alt="...">

<!-- WITH THIS -->
<img src="images/optimized/project-dashboard.jpg" alt="Professional business dashboard">
```

### Video Poster
```html
<!-- REPLACE THIS -->
<video poster="https://images.unsplash.com/photo-1559136555-9303baea8ebd?...">

<!-- WITH THIS -->
<video poster="images/optimized/video-poster.jpg">
```

## Professional Alt Text Guidelines:

- Be descriptive and specific
- Include business context
- Mention key visual elements
- Keep under 125 characters
- Avoid "image of" or "picture of"

## Example Professional Alt Text:
```html
<img src="images/optimized/project-dashboard.jpg" 
     alt="Modern business analytics dashboard showing revenue growth charts and KPI metrics">
```
EOF

echo "📋 Created HTML_UPDATE_GUIDE.md in images/ directory"
echo ""
echo "🚀 Aurora Template is ready for professional image integration!"
