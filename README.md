# APN Apple Push notifications for Deployd

## Install

	npm install dpd-apn --save

## Configure

1. Read for example this post [http://www.raywenderlich.com/32960/apple-push-notification-services-in-ios-6-tutorial-part-1](http://www.raywenderlich.com/32960/apple-push-notification-services-in-ios-6-tutorial-part-1)
2. Create an APN resource in Dashboard
3. Place your Key file and Certificate file on the server
4. Enter file-locations and passphrase in Settings

## Usage

	dpd.resourcename.post(
		{
			message: "Your message here",
			device: "deviceID"
		}, 
		function(result, err){
		}
	)
