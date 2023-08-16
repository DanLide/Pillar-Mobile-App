#!/bin/bash
# 1st param is a target prop: qa(default), uat, prod; 
# 2nd param is a dropbox token

target="RepairStackQA"
subversion="1"
if [[ $1 == "uat" ]]; then
     target="RepairStackUAT"
     subversion="2"
elif [[ $1 == "prod" ]]; then
     target="RepairStackPROD"
     subversion="0"
fi
echo "Target: $target"

cd ../
yarn install

cd ios
arch -x86_64 pod install

version=$(agvtool what-version | sed -n 2p |tr -d ' ')
echo "Current version: $version"

nextVersion=$(($((version)) + 1))
stringVersion="0.0.$nextVersion.$subversion"

echo "Next version: $nextVersion - $stringVersion"

agvtool new-version $nextVersion
agvtool new-marketing-version $stringVersion

cd ../ios_export

rm -Rf build/manifest.plist
rm -Rf build/RepairStack.ipa
rm -Rf build/RepairStackQA.ipa
rm -Rf build/RepairStackUAT.ipa
rm -Rf build/RepairStackPROD.ipa
rm -Rf build/DistributionSummary.plist
rm -Rf build/ExportOptions.plist
rm -Rf build/Packaging.log
rm -Rf build/RepairStack.xcarchive

xcodebuild -workspace ../ios/RepairStack.xcworkspace  -scheme "$target" -archivePath build/RepairStack.xcarchive archive

xcodebuild -exportArchive -archivePath build/RepairStack.xcarchive -exportPath build -exportOptionsPlist src/ExportOptions.plist

# where $2 is a dropbox key
#python src/upload_manifest.py --v "$stringVersion" --t "$2" --n "$target"

#rm -Rf build/manifest.plist
#rm -Rf build/RepairStack.ipa
#rm -Rf build/DistributionSummary.plist
#rm -Rf build/ExportOptions.plist
#rm -Rf build/Packaging.log
#rm -Rf build/RepairStack.xcarchive
