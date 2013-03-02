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
@class SSFiringViewController;
@interface SSMainViewController : UIViewController 
{
    SSAudioManager* sa1;
    FBSession* session;
    IBOutlet UIToolbar* toolBar;
    SSFiringViewController *firingViewController;
    
 }

@property  (nonatomic,strong) IBOutlet UIToolbar *toolBar;
@property (nonatomic, strong) SSFiringViewController* firingViewController;
@property (nonatomic,retain) IBOutlet SSNativeBridge* nativeBridge;
@property (nonatomic, strong) FBSession* session;
@property (nonatomic,retain) IBOutlet UIWebView* webView;

-(IBAction)callForFireMission:(id)sender;
- (void)showImagePicker;



@end
