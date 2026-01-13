#!/bin/bash

# Fix missing Foundation import in cordova-plugin-purchase
# This script should be run after `npx cap sync ios`

FILE="ios/capacitor-cordova-ios-plugins/sources/CordovaPluginPurchase/FileUtility.h"

if [ -f "$FILE" ]; then
    # Check if Foundation import is already present
    if ! grep -q "#import <Foundation/Foundation.h>" "$FILE"; then
        echo "Fixing FileUtility.h - adding Foundation import..."
        # Add the import at the beginning of the file
        sed -i '' '1i\
#import <Foundation/Foundation.h>\
' "$FILE"
        echo "✅ Fixed!"
    else
        echo "✅ FileUtility.h already has Foundation import"
    fi
else
    echo "⚠️  FileUtility.h not found at $FILE"
fi

