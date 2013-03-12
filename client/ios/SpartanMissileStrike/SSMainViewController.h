//
//  SSViewController.h
//  SpartanMissileStrike
//
//  Created by Shaun Guth on 3/11/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "SSNativeBridgeDelegate.h"
#import "SSSplashScreenViewController.h"

@class SSNativeBridge;

@interface SSMainViewController : UIViewController <SSNativeBridgeDelegate>

@property (strong, nonatomic) SSNativeBridge *nativeBridge;

@property (weak, nonatomic) IBOutlet UIWebView *webView;

-(void)initializeHtmlContent;

@end
