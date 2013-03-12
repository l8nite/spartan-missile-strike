//
//  SSAppDelegate.h
//  SpartanMissileStrike
//
//  Created by Shaun Guth on 3/11/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import <UIKit/UIKit.h>

@class SSViewController;

@interface SSAppDelegate : UIResponder <UIApplicationDelegate>

@property (strong, nonatomic) UIWindow *window;

@property (strong, nonatomic) SSViewController *viewController;

@end