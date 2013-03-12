//
//  SSMainViewController.h
//  SpartanMissileStrike
//
//  Created by Sherif on 1/9/13.
//  Copyright (c) 2013 Group 2. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "SSAudioManager.h"
#import "SSNativeBridge.h"
#import <FacebookSDK/FacebookSDK.h>
#import "SSFiringViewController.h"

@class SSFiringManager, AVCaptureVideoPreviewLayer;///Took this out: AVCamPreviewView
@interface SSMainViewController : UIViewController<UIImagePickerControllerDelegate,UINavigationControllerDelegate>
{
    SSAudioManager* sa1;
    FBSession* session;
    SSFiringManager *captureManager;
    
 }

@property (nonatomic,strong) SSFiringManager *captureManager;
@property (nonatomic,strong) UIView *videoPreviewView;
@property (nonatomic,strong) AVCaptureVideoPreviewLayer *captureVideoPreviewLayer;

@property (nonatomic,retain) IBOutlet SSNativeBridge* nativeBridge;
@property (nonatomic, strong) FBSession* session;
@property (nonatomic,retain) IBOutlet UIWebView* webView;




@end
