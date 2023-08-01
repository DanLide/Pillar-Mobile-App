#!/bin/bash

cd ../
yarn install

cd ios
arch -x86_64 pod install

version=$(agvtool what-version | sed -n 2p |tr -d ' ')
echo "Current version: $version"

nextVersion=$(($((version)) + 1))
stringVersion="0.0.${nextVersion}"

echo "Next version: $nextVersion $stringVersion"

agvtool new-version $nextVersion
agvtool new-marketing-version $stringVersion

cd ../ios_export

xcodebuild -workspace ../ios/RepairStack.xcworkspace  -scheme "$1" -archivePath build/RepairStack.xcarchive archive

xcodebuild -exportArchive -archivePath build/RepairStack.xcarchive -exportPath build -exportOptionsPlist src/ExportOptions.plist

python src/upload_manifest.py --v "$stringVersion" --t "$2"

rm -Rf build/manifest.plist
rm -Rf build/RepairStack.ipa
rm -Rf build/DistributionSummary.plist
rm -Rf build/ExportOptions.plist
rm -Rf build/Packaging.log
rm -Rf build/RepairStack.xcarchive
