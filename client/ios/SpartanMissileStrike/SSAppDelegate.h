//
//  SSAppDelegate.h
//  SpartanMissileStrike
//
//  Created by Sherif on 1/3/13.
//  Copyright (c) 2013 Group 2. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <FacebookSDK/FacebookSDK.h>
#import "SSAppDelegate.h"
#import "SSFaceBookAuthViewController.h"
#import <AudioToolbox/AudioToolbox.h>


extern NSString *const SMSSessionStateChangedNotification;

@class SSMainViewController;
@interface SSAppDelegate : UIResponder <UIApplicationDelegate>
{
    NSMutableDictionary* sessionDict;
    
}

@property (strong, nonatomic) UIWindow* window;
@property (strong, nonatomic) SSMainViewController* viewController;
@property (strong, nonatomic) FBSession *session;
@property (retain, nonatomic) NSMutableDictionary *sessionDict;
@property (strong, nonatomic) SSFaceBookAuthViewController *loginViewController;
@property (strong, nonatomic) UINavigationController *navController;


- (BOOL)openSessionWithAllowLoginUI:(BOOL)allowLoginUI;
+ (NSString *)FBErrorCodeDescription:(FBErrorCode) code;
- (void) closeSession;
- (void)showLoginView;


@end
