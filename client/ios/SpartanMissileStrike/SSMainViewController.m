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

@implementation SSMainViewController

@synthesize webView;
@synthesize nativeBridge;
@synthesize audioManager;
@synthesize facebookManager;

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.

    // initialize facebook sdk and start log-in process
    facebookManager = [[SSFacebookManager alloc] init];
    [facebookManager setDelegate:self];

    [facebookManager openSession];

    // listen for events that interest us
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(applicationDidBecomeActive) name:UIApplicationDidBecomeActiveNotification object:nil];
    
}

- (void)applicationDidBecomeActive
{
    [facebookManager handleDidBecomeActive];
}

- (BOOL)handleOpenURL:(NSURL *)url
{
    return [facebookManager handleOpenURL:url];
}

- (void)facebookUserDidLogIn
{
    audioManager = [[SSAudioManager alloc] init];

    // initialize the native bridge
    nativeBridge = [[SSNativeBridge alloc] init];
    [nativeBridge setDelegate:self];
    [webView setDelegate:nativeBridge];

    [self initializeHtmlContent];
}

- (void)facebookUserDidLogOut
{
    [facebookManager openSession];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)viewDidUnload
{
    [self setFacebookManager:nil];
    [self setAudioManager:nil];
    [self setNativeBridge:nil];
    [self setWebView:nil];
    [super viewDidUnload];
}

- (void)initializeHtmlContent
{
    NSURL *indexURL = [NSURL fileURLWithPath:[[NSBundle mainBundle] pathForResource:@"html/NativeBridge/NativeBridge_iOS-debug" ofType:@"html"] isDirectory:NO];
    NSURLRequest *initialLoadRequest = [NSURLRequest requestWithURL:indexURL];
    [webView loadRequest:initialLoadRequest];
}

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
    }
    else if ([function isEqualIgnoringCase:@"getPreference"]) {
    }
    else if ([function isEqualIgnoringCase:@"setPreference"]) {
    }
    else if ([function isEqualIgnoringCase:@"getFacebookAccessToken"]) {
        NSInteger callbackIdentifier = (NSInteger)[arguments objectForKey:@"identifier"];
        NSString *facebookAccessToken = [facebookManager accessToken];
        [self nativeBridgeCallback:callbackIdentifier withString:facebookAccessToken];
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
        [(SSAppDelegate *)[[UIApplication sharedApplication] delegate] hideSplashScreen];
    }
    else if ([function isEqualIgnoringCase:@"vibrate"]) {
    }
}

-(void)nativeBridgeCallback:(NSInteger)callbackIdentifier withString:(NSString *)argument
{
    // TODO - this doesn't appear to be working yet?
    NSString *callbackJS = [NSString stringWithFormat:@"NativeBridge.callback(%d, '%@')", callbackIdentifier, argument];
    [webView stringByEvaluatingJavaScriptFromString:callbackJS];
}

@end
