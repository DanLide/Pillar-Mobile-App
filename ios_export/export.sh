#!/bin/bash

xcodebuild -workspace ../ios/RepairStack.xcworkspace -scheme RepairStack_release -archivePath archive/RepairStack.xcarchive archive

xcodebuild -exportArchive -archivePath archive/RepairStack.xcarchive -exportPath build -exportOptionsPlist ExportOptions.plist

rm -Rf archive/RepairStack.xcarchive
