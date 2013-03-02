//
//  SSAppDelegate.m
//  SpartanMissileStrike
//
//  Created by Sherif on 1/3/13.
//  Copyright (c) 2013 Group 2. All rights reserved.
//

#import "SSAppDelegate.h"
#import "SSAudioManager.h"
#import "SSMainViewController.h"

static NSString* smsAppID = @"122930357857037";
NSString *const SMSSessionStateChangedNotification = @"com.missileapp.Spartan-Missile-Strike:SMSSessionStateChangedNotification";
@implementation SSAppDelegate

@synthesize session = _session;
@synthesize sessionDict;
@synthesize navController = _navController;
@synthesize loginViewController = _loginViewController;

@synthesize window;
@synthesize viewController;


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
    NSLog(@"FBSession URL:%@",[url description]);
    return [FBSession.activeSession handleOpenURL:url];
}



- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    
    
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    
       
    

    // Override point for customization after application launch.
    self.viewController= [[SSMainViewController alloc] initWithNibName:@"SSMainViewController" bundle:nil];
    self.window.rootViewController = self.viewController;
   
    [window addSubview:viewController.view];
    //self.window.backgroundColor = [UIColor whiteColor];
    [self.window makeKeyAndVisible];
    
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
@end
