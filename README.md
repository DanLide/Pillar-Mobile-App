# RepairStack

## Prerequisites

### Node & Watchman

Run the following commands in a Terminal using Homebrew:
```
brew install node
brew install watchman
```

If you have already installed Node on your system, make sure it is Node 14 or newer.

### Yarn

Once you have Node installed you can run the following both to install and upgrade Yarn:
```
npm install --global yarn
```

### Ruby

Currently, macOS 13.2 is shipped with Ruby 2.6.10, but React Native requires **Ruby 2.7.6**. 
Our suggestion is to install a Ruby version manager and to install the proper version of Ruby in your system.

Some common Ruby version manager are:

- [rbenv](https://github.com/rbenv/rbenv)
- [RVM](https://rvm.io/)
- [chruby](https://github.com/postmodern/chruby)
- [asdf-vm](https://github.com/asdf-vm) with the [asdf-ruby](https://github.com/asdf-vm/asdf-ruby) plugin

To check what is your current version of Ruby, you can run this command:
```
ruby --version
```

### Xcode
The easiest way to install Xcode is via the [Mac App Store](https://itunes.apple.com/us/app/xcode/id497799835?mt=12). 
Installing Xcode will also install the iOS Simulator and all the necessary tools to build your iOS app.

If you have already installed Xcode on your system, make sure it is version 10 or newer

#### Command Line Tools
You will also need to install the Xcode Command Line Tools. 
Open Xcode, then choose "Preferences..." from the Xcode menu. 
Go to the Locations panel and install the tools by selecting the most recent version in the Command Line Tools dropdown.

#### CocoaPods
For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).


**NOTE:** You can find more about React Native setup [here](https://reactnative.dev/docs/0.71/environment-setup?guide=native).

## Delivery

### Install required packages
Run this command to install Node and Pods dependencies
```
yarn install
```

### Setup environment
Setup `.env` for QA environment (`:uat` and `:prod` are available as well)
```
yarn env:qa
```

### Create archive
Build archive for QA environment (`:uat` and `:prod` are available as well)
```
yarn archive:qa
```

### Create IPA from archive
```
yarn generate-ipa
```

Generated IPA can be found in the `build` directory.

### Create IPA from xcode

Product -> Archive

After successfully building 

Distribute App -> Enterprise -> Automatically manage signing -> Export

## Run app locally

### Install required packages
Run this command to install Node and Pods dependencies
```
yarn install
```

### Setup environment
Setup `.env` for QA environment (`:uat` and `:prod` are available as well)
```
yarn env:qa
```

### Start Metro Bundler
```
yarn start
```

### Build and run app
Run this command in a second terminal tab to build QA app (`:uat` and `:prod` are available as well)
```
yarn ios:qa
```
