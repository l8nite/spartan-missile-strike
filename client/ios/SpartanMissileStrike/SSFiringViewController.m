//
//  SSCameraViewController.m
//  SpartanMissileStrike
//
//  Created  on 3/13/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import "SSFiringViewController.h"
#import <AVFoundation/AVFoundation.h>

@implementation SSFiringViewController

@synthesize cameraPreviewView;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
    }
    return self;
}

- (void)viewDidLoad
{
    NSLog(@"Hey I loaded!");
    [super viewDidLoad];
    
    AVCaptureSession *captureSession = [[AVCaptureSession alloc] init];
    AVCaptureDevice *videoCaptureDevice = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];

    AVCaptureDeviceInput *videoInput = [AVCaptureDeviceInput deviceInputWithDevice:videoCaptureDevice error:nil];
    if ([captureSession canAddInput:videoInput]) {
        [captureSession addInput:videoInput];
        
        AVCaptureVideoPreviewLayer *videoPreviewLayer = [[AVCaptureVideoPreviewLayer alloc] initWithSession:captureSession];
        [videoPreviewLayer setFrame:[cameraPreviewView bounds]];
        [videoPreviewLayer setVideoGravity:AVLayerVideoGravityResizeAspectFill];
        [cameraPreviewView.layer addSublayer:videoPreviewLayer];
        
        dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
            [captureSession startRunning];
        });
    }
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)viewDidUnload {
    NSLog(@"Hey, I unloaded");
    [self setCameraPreviewView:nil];
    [super viewDidUnload];
}
@end
