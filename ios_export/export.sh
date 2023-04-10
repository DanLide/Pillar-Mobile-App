#!/bin/bash

xcodebuild -workspace ../ios/RepairStack.xcworkspace  -scheme RepairStackRelease -archivePath build/RepairStack.xcarchive archive

xcodebuild -exportArchive -archivePath build/RepairStack.xcarchive -exportPath build -exportOptionsPlist src/ExportOptions.plist

python src/upload_manifest.py --v "$1" --t "$2"

rm -Rf build/manifest.plist
rm -Rf build/RepairStack.ipa
rm -Rf build/DistributionSummary.plist
rm -Rf build/ExportOptions.plist
rm -Rf build/Packaging.log
rm -Rf build/RepairStack.xcarchive
