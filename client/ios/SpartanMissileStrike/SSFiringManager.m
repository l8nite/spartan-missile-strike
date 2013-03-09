//
//  SSFiringManager.m
//  SpartanMissileStrike
//
//  Created by Sherif on 3/5/13.
//  Copyright (c) 2013 Group 2. All rights reserved.
//

#import "SSFiringManager.h"
#import <MobileCoreServices/UTCoreTypes.h>
#import <AssetsLibrary/AssetsLibrary.h>
#import <ImageIO/CGImageProperties.h>

#pragma mark -

@interface SSFiringManager (InternalUtilityMethods)
- (AVCaptureDevice *) cameraWithPosition:(AVCaptureDevicePosition)position;
- (AVCaptureDevice *) backFacingCamera;
@end


#pragma mark -
@implementation SSFiringManager

@synthesize session;
@synthesize videoInput;

- (id) init
{
    self = [super init];
    if (self != nil) {
    }
    return self;
    
}


- (BOOL) setupSession
{
    BOOL success = NO;
    
    // Init the device inputs
    NSError *errorDuh;
    
    
    
	// Set torch and flash mode to auto
	if ([[self backFacingCamera] hasFlash]) {
		if ([[self backFacingCamera] lockForConfiguration:nil]) {
			if ([[self backFacingCamera] isFlashModeSupported:AVCaptureFlashModeAuto]) {
				[[self backFacingCamera] setFlashMode:AVCaptureFlashModeAuto];
			}
			[[self backFacingCamera] unlockForConfiguration];
		}
	}
	if ([[self backFacingCamera] hasTorch]) {
		if ([[self backFacingCamera] lockForConfiguration:nil]) {
			if ([[self backFacingCamera] isTorchModeSupported:AVCaptureTorchModeAuto]) {
				[[self backFacingCamera] setTorchMode:AVCaptureTorchModeAuto];
			}
			[[self backFacingCamera] unlockForConfiguration];
		}
	}
    
    
    AVCaptureDeviceInput *newVideoInput = [[AVCaptureDeviceInput alloc] initWithDevice:[self backFacingCamera] error:&errorDuh];
    AVCaptureSession *newCaptureSession = [[AVCaptureSession alloc] init];
    
   // NSLog(@"Inside setupSession");
    // Add inputs and output to the capture session
    if ([newCaptureSession canAddInput:newVideoInput]) {
           NSLog(@"can add input");

        [newCaptureSession addInput:newVideoInput];
        for (id obj in newCaptureSession.inputs){
            NSLog(@"Inpi: %@",obj);
        
        }

    }else{
        
        NSLog(@"errro %@",errorDuh);
        
    }
    
    [self setVideoInput:newVideoInput];
    [self setSession:newCaptureSession];
    
    success = YES;
    
    return success;
}

@end


#pragma mark -
@implementation SSFiringManager (InternalUtilityMethods)

// Find a camera with the specificed AVCaptureDevicePosition, returning nil if one is not found
- (AVCaptureDevice *) cameraWithPosition:(AVCaptureDevicePosition) position
{
    NSArray *devices = [AVCaptureDevice devicesWithMediaType:AVMediaTypeVideo];
    for (AVCaptureDevice *device in devices) {
        if ([device position] == position) {
            return device;
        }
    }
    return nil;
}

// Find a back facing camera, returning nil if one is not found
- (AVCaptureDevice *) backFacingCamera
{
    return [self cameraWithPosition:AVCaptureDevicePositionBack];
}
@end


