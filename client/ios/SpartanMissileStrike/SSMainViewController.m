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

@implementation SSMainViewController

@synthesize webView;
@synthesize nativeBridge;
@synthesize audioManager;

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.
    
    audioManager = [[SSAudioManager alloc] init];

    // initialize the native bridge
    nativeBridge = [[SSNativeBridge alloc] init];
    [nativeBridge setDelegate:self];
    [webView setDelegate:nativeBridge];
    [self initializeHtmlContent];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)viewDidUnload
{
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
        // trigger facebook authentication flow if we don't have access token already
    }
    else if ([function isEqualIgnoringCase:@"playSound"]) {
        NSString *soundIdentifier = (NSString *)[arguments objectForKey:@"soundID"];
        [audioManager playSound:soundIdentifier];
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

@end
