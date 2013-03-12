//
//  SSAppDelegate.h
//  SpartanMissileStrike
//
//  Created by Shaun Guth on 3/11/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import <UIKit/UIKit.h>

@class SSMainViewController;
@class SSSplashScreenViewController;

@interface SSAppDelegate : UIResponder <UIApplicationDelegate>

@property (strong, nonatomic) UIWindow *window;

@property (strong, nonatomic) SSMainViewController *viewController;
@property (strong, nonatomic) SSSplashScreenViewController *splashScreenViewController;

- (void)showSplashScreen;
- (void)hideSplashScreen;

@end