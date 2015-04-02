# APN Apple Push notifications for Deployd

## Install

	npm install dpd-apn --save

## Usage

	dpd.resourcename.post(
		{
			message: "Your message here",
			device: "deviceID"
		}, function(result, err){}
	)
