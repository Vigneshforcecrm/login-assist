#!/bin/bash
# Create simple PNG icons using ImageMagick (if available) or base64 placeholders

# Check if convert (ImageMagick) is available
if command -v convert &> /dev/null; then
    # Create icons with ImageMagick
    convert -size 16x16 xc:#0b66c3 -fill white -font DejaVu-Sans -pointsize 10 -gravity center -annotate +0+0 'SF' icon16.png
    convert -size 48x48 xc:#0b66c3 -fill white -font DejaVu-Sans -pointsize 32 -gravity center -annotate +0+0 'SF' icon48.png
    convert -size 128x128 xc:#0b66c3 -fill white -font DejaVu-Sans -pointsize 86 -gravity center -annotate +0+0 'SF' icon128.png
    echo "Icons created with ImageMagick"
else
    # Create base64 encoded minimal PNG icons
    # 16x16 blue square
    echo "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAKklEQVR4nGNgYGD4z4AHMANRHUNHB6OhgdEQGg0N1BEaTEQyYDSERkMDAAvKAgnm8/8kAAAAAElFTkSuQmCC" | base64 -d > icon16.png
    # 48x48 blue square  
    echo "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAOElEQVRoge3PMQ0AIAwEwS/kX8KiCLqQdAJ7u2wuuQAAAAAAAAAAAAAAAAAAAAAAAAAAwF8NADgBKCEBDTb9AAAAAElFTkSuQmCC" | base64 -d > icon48.png
    # 128x128 blue square
    echo "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAWUlEQVR4nO3BgQAAAADDoPlTH+ACVQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4GPAAAHiK5YPEAAAAASUVORK5CYII=" | base64 -d > icon128.png
    echo "Placeholder icons created"
fi
