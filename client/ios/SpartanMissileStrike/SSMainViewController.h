//
//  SSViewController.h
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

@interface SSMainViewController : UIViewController <SSNativeBridgeDelegate>

@property (strong, nonatomic) SSNativeBridge *nativeBridge;
@property (strong, nonatomic) SSAudioManager *audioManager;
@property (strong, nonatomic) SSFacebookManager *facebookManager;

@property (weak, nonatomic) IBOutlet UIWebView *webView;

-(void)showSplashScreen;

@end
