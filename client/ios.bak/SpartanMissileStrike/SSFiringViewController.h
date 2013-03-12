//
//  SSFiringViewController.h
//  SpartanMissileStrike
//
//  Created by Sherif on 3/5/13.
//  Copyright (c) 2013 Group 2. All rights reserved.
//

#import <UIKit/UIKit.h>

@class SSFiringManager, AVCamPreviewView, AVCaptureVideoPreviewLayer;
@interface SSFiringViewController : UIViewController <UIImagePickerControllerDelegate,UINavigationControllerDelegate> {
}

@property (nonatomic,strong) SSFiringManager *captureManager;
@property (nonatomic,strong) IBOutlet UIView *videoPreviewView;
@property (nonatomic,strong) AVCaptureVideoPreviewLayer *captureVideoPreviewLayer;

- (IBAction) showCameraOverlay:(id)sender;


@end