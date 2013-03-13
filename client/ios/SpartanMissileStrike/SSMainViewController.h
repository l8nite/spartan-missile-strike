//
//  SSMainViewController.h
//  SpartanMissileStrike
//
//  Created by Shaun Guth on 3/11/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "SSNativeBridgeDelegate.h"

@class SSNativeBridge;
@class SSAudioManager;
@class SSFacebookManager;
@class SSFiringViewController;
@class SSPreferenceManager;
@class SSLocationManager;

@interface SSMainViewController : UIViewController

@property (strong, nonatomic) SSNativeBridge *nativeBridge;
@property (strong, nonatomic) SSAudioManager *audioManager;
@property (strong, nonatomic) SSFacebookManager *facebookManager;
@property (strong, nonatomic) SSPreferenceManager *preferenceManager;
@property (strong, nonatomic) SSLocationManager *locationManager;
@property (strong, nonatomic) SSFiringViewController *firingViewController;

@property (weak, nonatomic) IBOutlet UIWebView *webView;

-(void)showSplashScreen;

@end

@interface SSMainViewController (SSNativeBridgeDelegate) <SSNativeBridgeDelegate>
@end