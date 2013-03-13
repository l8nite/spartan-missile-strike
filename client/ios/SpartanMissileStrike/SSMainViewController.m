//
//  SSViewController.m
//  SpartanMissileStrike
//
//  Created by Shaun Guth on 3/11/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import "SSAppDelegate.h"
#import "SSMainViewController.h"
#import "SSNativeBridge.h"
#import "SSAudioManager.h"
#import "NSString+CaseInsensitiveComparison.h"
#import "SSFacebookManager.h"
#import "SSSplashScreenViewController.h"
#import "SSFiringViewController.h"

@implementation SSMainViewController

@synthesize webView, nativeBridge, audioManager, facebookManager, firingViewController;

- (void)viewDidLoad
{
    [super viewDidLoad];

    facebookManager = [[SSFacebookManager alloc] init];
    audioManager = [[SSAudioManager alloc] init];
    nativeBridge = [[SSNativeBridge alloc] initWithWebView:webView andDelegate:self];

    webView.backgroundColor = [UIColor clearColor];

    NSURL *indexURL = [NSURL fileURLWithPath:[[NSBundle mainBundle] pathForResource:@"html/NativeBridge/NativeBridge_iOS-debug" ofType:@"html"] isDirectory:NO];
    NSURLRequest *initialLoadRequest = [NSURLRequest requestWithURL:indexURL];
    [webView loadRequest:initialLoadRequest];
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

    [firingViewController removeFromParentViewController];
    firingViewController = nil;
}

@end

@implementation SSMainViewController (SSNativeBridgeDelegate)

-(void)nativeBridgeFunction:(NSString *)function withArguments:(NSDictionary *)arguments
{
    NSLog(@"Native Bridge: %@ called with arguments: %@", function, arguments);
    
    if ([function isEqualIgnoringCase:@"getLocationUpdates"]) {
    }
    else if ([function isEqualIgnoringCase:@"getOrientationUpdates"]) {
    }
    else if ([function isEqualIgnoringCase:@"getCurrentOrientation"]) {
    }
    else if ([function isEqualIgnoringCase:@"getCurrentLocation"]) {
    }
    else if ([function isEqualIgnoringCase:@"showFireMissileScreen"]) {
        [self showFiringScreen];
    }
    else if ([function isEqualIgnoringCase:@"getPreference"]) {
    }
    else if ([function isEqualIgnoringCase:@"setPreference"]) {
    }
    else if ([function isEqualIgnoringCase:@"getFacebookAccessToken"]) {
        [facebookManager getAccessTokenWith:^(NSString *accessToken) {
            [nativeBridge callbackWithResult:accessToken forFunction:function withArguments:arguments];
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
    }
}

@end
