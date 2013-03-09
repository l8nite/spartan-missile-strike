//
//  SSFiringViewController.m
//  SpartanMissileStrike
//
//  Created by Sherif on 3/5/13.
//  Copyright (c) 2013 Group 2. All rights reserved.
//

#import "SSFiringViewController.h"
#import "SSFiringManager.h"
#import <AVFoundation/AVFoundation.h>
#import "SSOverlay.h"

//transform values for full screen support
#define CAMERA_TRANSFORM_X 1
#define CAMERA_TRANSFORM_Y 1.12412

//iphone screen dimensions
#define SCREEN_WIDTH  320
#define SCREEN_HEIGTH 480


static void *AVCamFocusModeObserverContext = &AVCamFocusModeObserverContext;
@interface SSFiringViewController ()

@end

@implementation SSFiringViewController


@synthesize captureManager;
@synthesize videoPreviewView;
@synthesize captureVideoPreviewLayer;


- (IBAction) showCameraOverlay:(id)sender {
	
	//create an overlay view instance
	SSOverlay *overlay = [[SSOverlay alloc]
							initWithFrame:CGRectMake(0, 0, SCREEN_WIDTH, SCREEN_HEIGTH)];
	
	//create a new image picker instance
	UIImagePickerController *picker =
	[[UIImagePickerController alloc] init];
	//set source to video!
	picker.sourceType = UIImagePickerControllerSourceTypeCamera;
	//hide all controls
	picker.showsCameraControls = NO;
	picker.navigationBarHidden = YES;
	picker.toolbarHidden = YES;
	//make the video preview full size
	picker.wantsFullScreenLayout = YES;
	picker.cameraViewTransform =
	CGAffineTransformScale(picker.cameraViewTransform,
						   CAMERA_TRANSFORM_X,
						   CAMERA_TRANSFORM_Y);
	//set our custom overlay view
	picker.cameraOverlayView = overlay;
	
	//show picker
	[self presentModalViewController:picker animated:YES];
	
}

- (void)viewDidLoad
{
    
	if ([self captureManager] == nil) {
		SSFiringManager *manager = [[SSFiringManager alloc] init];
		[self setCaptureManager:manager];
		
		if ([[self captureManager] setupSession]) {
            // Create video preview layer and add it to the UI
			AVCaptureVideoPreviewLayer *newCaptureVideoPreviewLayer = [[AVCaptureVideoPreviewLayer alloc] initWithSession:[[self captureManager] session]];
			UIView *view = [self videoPreviewView];
			CALayer *viewLayer = [view layer];
			[viewLayer setMasksToBounds:YES];
			
			CGRect bounds = [view bounds];
			[newCaptureVideoPreviewLayer setFrame:bounds];
            
			
			[newCaptureVideoPreviewLayer setVideoGravity:AVLayerVideoGravityResizeAspectFill];
			[viewLayer insertSublayer:newCaptureVideoPreviewLayer below:[[viewLayer sublayers] objectAtIndex:0]];
			[self setCaptureVideoPreviewLayer:newCaptureVideoPreviewLayer];
			
            // Start the session. This is done asychronously since -startRunning doesn't return until the session is running.
			dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
				[[[self captureManager] session] startRunning];
			});
            
            
            UIImageView *reticleView = [[UIImageView alloc] initWithFrame:CGRectMake(50, 50, 220, 220)];
            reticleView.image = [UIImage imageNamed:@"artilleryreticle3"];
            [view addSubview:reticleView];
            
            
            
		}
	}
    
    [super viewDidLoad];
}

@end
