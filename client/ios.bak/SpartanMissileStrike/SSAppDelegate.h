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
#import <CoreLocation/CoreLocation.h>
#import <CoreMotion/CoreMotion.h>
#import "SSFiringManager.h"

extern NSString *const SMSSessionStateChangedNotification;
extern NSString *const SMSActivatesCameraPreviewNotification;

@class SSMainViewController;
@interface SSAppDelegate : UIResponder <UIApplicationDelegate,CLLocationManagerDelegate, UIApplicationDelegate>
{
    NSMutableDictionary* sessionDict;
    CLLocationManager *locationManager;
    
    UIWindow *window;
	SSFiringManager *firingViewController;
    SSMainViewController* viewController;
}

@property (strong, nonatomic) UIWindow* window;
@property (strong, nonatomic) SSMainViewController* viewController;
@property (strong, nonatomic) SSFiringManager* firingViewController;
@property (strong, nonatomic) FBSession *session;
@property (retain, nonatomic) NSMutableDictionary *sessionDict;
@property (strong, nonatomic) SSFaceBookAuthViewController *loginViewController;
@property (strong, nonatomic) UINavigationController *navController;
@property (strong, nonatomic) CLLocationManager *locationManager;
@property (strong, nonatomic, readonly) CMMotionManager *sharedMotionManager;



- (BOOL)openSessionWithAllowLoginUI:(BOOL)allowLoginUI;
+ (NSString *)FBErrorCodeDescription:(FBErrorCode) code;
- (void) closeSession;
- (void)showLoginView;


@end

