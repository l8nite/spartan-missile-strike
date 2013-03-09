//
//  SSAppDelegate.m
//  SpartanMissileStrike
//
//  Created by Sherif on 1/3/13.
//  Copyright (c) 2013 Group 2. All rights reserved.
//

#import "SSAppDelegate.h"
#import "SSAudioManager.h"
#import "SSNativeBridge.h"
#import "SSFiringManager.h"
#import "SSMainViewController.h"


static NSString* smsAppID = @"122930357857037";
NSString *const SMSSessionStateChangedNotification = @"com.missileapp.Spartan-Missile-Strike:SMSSessionStateChangedNotification";

@interface SSAppDelegate ()
{
    CMMotionManager *motionManager;
}
@property (nonatomic,strong,readonly) CMDeviceMotion *motionManager;
@end

@implementation SSAppDelegate

@synthesize session = _session;
@synthesize sessionDict;
@synthesize navController = _navController;
@synthesize loginViewController = _loginViewController;
@synthesize locationManager =_locationManager;
@synthesize motionManager= _motionManager;

@synthesize window;
@synthesize viewController;
@synthesize firingViewController; 


/**
 Facebook Logging
 */


- (void)createAndPresentLoginView {
    if (self.loginViewController == nil) {
        self.loginViewController = [[SSFaceBookAuthViewController alloc] init];
        UIViewController *topViewController = [self.navController topViewController];
        [topViewController presentViewController:self.loginViewController animated:NO completion:nil];
    }
}

- (void)showLoginView {
    if (self.loginViewController == nil) {
        [self createAndPresentLoginView];
    } else {
        [self.loginViewController loginFailed];
    }
}

- (void)sessionStateChanged:(FBSession *)session
                      state:(FBSessionState)state
                      error:(NSError *)error
{
    NSLog(@"Session Status: FBSessionState %@",[session description]);
    NSLog(@"Session Status: FBToken %@",session.accessTokenData.accessToken);

    
//    SSNativeBridge *fbtoken = [[SSNativeBridge alloc] init];
//    NSURL* url = [NSURL URLWithString:@"spartan-missile-strike://getFacebookAccessToken/?argument=%7bsound%3A%22Moderato%22%7D"];
//    [fbtoken dispatchNativeBridgeEventsFromURL:url];
   
    
    sessionDict = (NSMutableDictionary *)session;
    NSLog(@"Session Dict: FBSessionState %@",[sessionDict description]);
    NSLog(@"SMS ID: %@",smsAppID);
    
    switch (state) {
        case FBSessionStateOpen: {
            
            if (self.loginViewController != nil) {
                UIViewController *topViewController = [self.navController topViewController];
                [topViewController dismissViewControllerAnimated:YES completion:nil];
                self.loginViewController = nil;
            }
            
            FBCacheDescriptor *cacheDescriptor = [FBFriendPickerViewController cacheDescriptor];
            [cacheDescriptor prefetchAndCacheForSession:session];
        }
            break;
        case FBSessionStateClosed: {
            NSLog(@"Session Closed: FBSessionState %@",[session description]);
            
            UIViewController *topViewController = [self.navController topViewController];
            UIViewController *presentViewController = [topViewController presentedViewController];
            if (presentViewController != nil) {
                [topViewController dismissViewControllerAnimated:YES completion:nil];
            }
            [self.navController popToRootViewControllerAnimated:NO];
            [FBSession.activeSession closeAndClearTokenInformation];
            
            [self performSelector:@selector(showLoginView)
                       withObject:nil
                       afterDelay:0.5f];
        }
            break;
        case FBSessionStateClosedLoginFailed: {
            [self performSelector:@selector(showLoginView)
                       withObject:nil
                       afterDelay:0.5f];
        }
            break;
        default:
            break;
    }
    
    [[NSNotificationCenter defaultCenter] postNotificationName:SMSSessionStateChangedNotification
                                                        object:session];
    if (error) {
        UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:[NSString stringWithFormat:@"Error: %@",[SSAppDelegate FBErrorCodeDescription:error.code]]
                                                            message:error.localizedDescription
                                                           delegate:nil
                                                  cancelButtonTitle:@"OK"
                                                  otherButtonTitles:nil];
        [alertView show];
    }
}

- (BOOL)openSessionWithAllowLoginUI:(BOOL)allowLoginUI {
    NSLog(@"allowLoginUI :%i",allowLoginUI);
    
    return [FBSession openActiveSessionWithReadPermissions:nil
                                              allowLoginUI:allowLoginUI
                                         completionHandler:^(FBSession *session, FBSessionState state, NSError *error) {
                                             [self sessionStateChanged:session state:state error:error];
                                         }];
}


+ (NSString *)FBErrorCodeDescription:(FBErrorCode) code {
    switch(code){
        case FBErrorInvalid :{
            return @"FBErrorInvalid";
        }
        case FBErrorOperationCancelled:{
            return @"FBErrorOperationCancelled";
        }
        case FBErrorLoginFailedOrCancelled:{
            return @"FBErrorLoginFailedOrCancelled";
        }
        case FBErrorRequestConnectionApi:{
            return @"FBErrorRequestConnectionApi";
        }case FBErrorProtocolMismatch:{
            return @"FBErrorProtocolMismatch";
        }
        case FBErrorHTTPError:{
            return @"FBErrorHTTPError";
        }
        case FBErrorNonTextMimeTypeReturned:{
            return @"FBErrorNonTextMimeTypeReturned";
        }
        case FBErrorNativeDialog:{
            return @"FBErrorNativeDialog";
        }
        default:
            return @"[Unknown]";
    }
}

- (void) closeSession {
    [FBSession.activeSession closeAndClearTokenInformation];
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication
         annotation:(id)annotation {
    // FBSample logic
    // We need to handle URLs by passing them to FBSession in order for SSO authentication
    // to work.
    NSLog(@"FBSession URL:%@",[url description]);
    return [FBSession.activeSession handleOpenURL:url];
}



- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    NSLog(@"Shared LocationManager latitude: %f",self.sharedLocationManager.location.coordinate.latitude);
      
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    
    // Override point for customization after application launch.
    self.viewController= [[SSMainViewController alloc] initWithNibName:@"SSMainViewController" bundle:nil];
    self.window.rootViewController = self.viewController;
   
    [window addSubview:viewController.view];
   
    [self.window makeKeyAndVisible];
    
    // FBSample logic
    // See if we have a valid token for the current state.
    if (![self openSessionWithAllowLoginUI:NO]) {
        // No? Display the login page.
        [self showLoginView];
    }

    return YES;
}

- (void)applicationWillResignActive:(UIApplication *)application
{
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}


+ (SSAppDelegate *)sharedAppDelegate{

    return (SSAppDelegate *)[UIApplication sharedApplication].delegate;

}

- (CMMotionManager *)sharedMotionManager
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        motionManager = [[CMMotionManager alloc] init];
    });
    return motionManager;
}

- (CLLocationManager *)sharedLocationManager
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        locationManager = [[CLLocationManager alloc] init];
        locationManager.delegate = self;
        locationManager.distanceFilter = kCLDistanceFilterNone;
        locationManager.desiredAccuracy = kCLLocationAccuracyBest;
        [locationManager startUpdatingLocation];
    });
    return locationManager;
}
@end
