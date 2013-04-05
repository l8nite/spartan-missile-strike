//
//  SSMainViewController.m
//  SpartanMissileStrike
//
//  Created   on 3/11/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import "SSAppDelegate.h"
#import "SSAudioManager.h"
#import "SSFacebookManager.h"
#import "SSFiringViewController.h"
#import "SSLocationManager.h"
#import "SSMainViewController.h"
#import "SSNativeBridge.h"
#import "SSOrientationManager.h"
#import "SSPreferenceManager.h"
#import "SSSplashScreenViewController.h"

#import "NSString+CaseInsensitiveComparison.h"

#import <AudioToolbox/AudioServices.h>

@implementation SSMainViewController

@synthesize webView;
@synthesize nativeBridge;
@synthesize audioManager;
@synthesize facebookManager;
@synthesize firingViewController;
@synthesize preferenceManager;
@synthesize locationManager;
@synthesize orientationManager;

- (void)viewDidLoad
{
    [super viewDidLoad];

    facebookManager = [[SSFacebookManager alloc] init];
    audioManager = [[SSAudioManager alloc] init];
    preferenceManager = [[SSPreferenceManager alloc] init];
    locationManager = [[SSLocationManager alloc] init];
    orientationManager = [[SSOrientationManager alloc] init];
    nativeBridge = [[SSNativeBridge alloc] initWithWebView:webView andDelegate:self];
    [self _initWebView];

    NSURL *indexURL = [NSURL fileURLWithPath:[[NSBundle mainBundle] pathForResource:@"html/MissileApp-iOS" ofType:@"html"] isDirectory:NO];
    NSURLRequest *initialLoadRequest = [NSURLRequest requestWithURL:indexURL];
    [webView loadRequest:initialLoadRequest];    
}

-(void)_initWebView
{
    webView.backgroundColor = [UIColor clearColor];
    webView.scrollView.bounces = NO;    
}

- (void)viewDidUnload
{
    facebookManager = nil;
    audioManager = nil;
    nativeBridge = nil;
    webView = nil;

    [super viewDidUnload];
}

-(void)showSplashScreen
{
    if ([self presentedViewController] == nil) {
        SSSplashScreenViewController *splashScreenViewController = [[SSSplashScreenViewController alloc] initWithNibName:@"SSSplashScreenViewController" bundle:[NSBundle mainBundle]];
        splashScreenViewController.modalTransitionStyle = UIModalTransitionStyleCrossDissolve;
        [self presentViewController:splashScreenViewController animated:NO completion:nil];
    }
}

-(void)hideSplashScreen
{
    if ([[self presentedViewController] isKindOfClass:[SSSplashScreenViewController class]]) {
        [[self presentedViewController] dismissViewControllerAnimated:YES completion:nil];
    }
}

-(void)showFiringScreen
{
    if (firingViewController != nil) {
        return;
    }

    firingViewController = [[SSFiringViewController alloc] initWithNibName:@"SSFiringViewController" bundle:[NSBundle mainBundle]];
    [self.view insertSubview:firingViewController.view belowSubview:webView];
}

-(void)hideFiringScreen
{
    if (firingViewController == nil) {
        return;
    }

    [firingViewController.view removeFromSuperview];
    [firingViewController removeFromParentViewController];
    firingViewController = nil;
}

@end

@implementation SSMainViewController (SSNativeBridgeDelegate)

-(void)nativeBridgeFunction:(NSString *)function withArguments:(NSDictionary *)arguments
{
    NSLog(@"Native Bridge: %@ called with arguments: %@", function, arguments);

    if ([function isEqualIgnoringCase:@"startLocationUpdates"]) {
        [locationManager startUpdatingLocationWithCallback:^(CLLocationCoordinate2D location) {

            NSMutableDictionary *locationDictionary = [[NSMutableDictionary alloc] init];
            //NSNumber *latitude = [NSNumber numberWithDouble:(double)location.latitude];
            //NSNumber *longitude = [NSNumber numberWithDouble:(double)location.longitude];
            
            //NSNumber *altitude = [NSNumber numberWithDouble:(double)locationManager.location.altitude];
            //NSNumber *azimuth = [NSNumber numberWithDouble:(double) locationManager.heading.magneticHeading];
            
            NSNumber *azimuth = [NSNumber numberWithDouble:(double)location.latitude];
            NSNumber *altitude = [NSNumber numberWithDouble:(double)location.longitude];
 
            //[locationDictionary setObject:latitude forKey:@"latitude"];
            //[locationDictionary setObject:longitude forKey:@"longitude"];
            
            [locationDictionary setObject:azimuth forKey:@"azimuth" ];
            [locationDictionary setObject:altitude forKey:@"altitude"];
            
            [nativeBridge callbackWithDictionary:locationDictionary forFunction:function withArguments:arguments];
        }];
    }
    else if ([function isEqualIgnoringCase:@"stopLocationUpdates"]) {
        [locationManager stopUpdatingLocation];
    }
    else if ([function isEqualIgnoringCase:@"startOrientationUpdates"]) {
        [orientationManager startUpdatingOrientationWithCallback:^(CMAttitude *attitude) {
            NSMutableDictionary *orientationDictionary = [[NSMutableDictionary alloc] init];
            NSNumber *pitch = [NSNumber numberWithDouble:(double)attitude.pitch];
            NSNumber *yaw = [NSNumber numberWithDouble:(double)attitude.yaw];
            NSNumber *roll = [NSNumber numberWithDouble:(double)attitude.roll];
            
            [orientationDictionary setObject:pitch forKey:@"pitch"];
            [orientationDictionary setObject:yaw forKey:@"yaw"];
            [orientationDictionary setObject:roll forKey:@"roll"];
            
            [nativeBridge callbackWithDictionary:orientationDictionary forFunction:function withArguments:arguments];
        }];
    }
    else if ([function isEqualIgnoringCase:@"stopOrientationUpdates"]) {
        [orientationManager stopUpdatingOrientation];
    }
    else if ([function isEqualIgnoringCase:@"showFireMissileScreen"]) {
        [self showFiringScreen];
    }
    else if ([function isEqualIgnoringCase:@"hideFireMissileScreen"]) {
        [self hideFiringScreen];
    }
    else if ([function isEqualIgnoringCase:@"getPreference"]) {
        [preferenceManager getPreferences:[arguments objectForKey:@"preferences"] withCompletionHandler:^(NSDictionary *preferences) {
            [nativeBridge callbackWithDictionary:preferences forFunction:function withArguments:arguments];
        }];
    }
    else if ([function isEqualIgnoringCase:@"setPreference"]) {
        __weak typeof(self) weakSelf = self;
        [preferenceManager setPreferences:[arguments objectForKey:@"preferences"] withCompletionHandler:^(BOOL success) {
            NSDictionary *response = [NSDictionary dictionaryWithObject:[NSNumber numberWithBool:success] forKey:@"succeeded"];
            [weakSelf.nativeBridge callbackWithDictionary:response forFunction:function withArguments:arguments];
        }];
    }
    else if ([function isEqualIgnoringCase:@"getFacebookAccessToken"]) {
        [facebookManager getAccessTokenWith:^(NSString *accessToken) {
            [nativeBridge callbackWithString:accessToken forFunction:function withArguments:arguments];
        }];
    }
    else if ([function isEqualIgnoringCase:@"playSound"]) {
        NSString *soundIdentifier = (NSString *)[arguments objectForKey:@"soundID"];
        NSInteger loop = (NSInteger)[arguments objectForKey:@"loop"];

        [audioManager playSound:soundIdentifier loopCount:(loop ? -1 : 0)];
    }
    else if ([function isEqualIgnoringCase:@"stopSound"]) {
        NSString *soundIdentifier = (NSString *)[arguments objectForKey:@"soundID"];
        [audioManager stopSound:soundIdentifier];
    }
    else if ([function isEqualIgnoringCase:@"hideSplash"]) {
        [self hideSplashScreen];
    }
    else if ([function isEqualIgnoringCase:@"vibrate"]) {
        AudioServicesPlaySystemSound(kSystemSoundID_Vibrate);
    }
}

@end
