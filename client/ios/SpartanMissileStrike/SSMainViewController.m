//
//  SSMainViewController.m
//  SpartanMissileStrike
//
//  Created by Sherif on 1/9/13.
//  Copyright (c) 2013 Group 2. All rights reserved.
//

#import "SSMainViewController.h"
#import "SSAudioManager.h"
#import "SSAppDelegate.h"
#import "SSFiringManager.h"
#import <AVFoundation/AVFoundation.h>


NSString *const SMSActivatesCameraPreviewNotification = @"com.missileapp.Spartan-Missile-Strike:SMSActivatesCameraPreviewNotification";

@implementation SSMainViewController
@synthesize webView = _webView;
@synthesize nativeBridge;
@synthesize session,captureManager,videoPreviewView,captureVideoPreviewLayer;

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    nativeBridge = [[SSNativeBridge alloc]init];
    _webView = [[UIWebView alloc] init];
    CGRect bounds = [self.view bounds];

    [_webView setFrame:bounds];
    _webView.scalesPageToFit = YES;
    _webView.opaque = NO;
    [_webView setDelegate:nativeBridge];
    _webView.backgroundColor = [UIColor clearColor];
    [self.view addSubview:_webView];
    
    
    
    
    
    [ self  loadHTMLContent];
    
    
    
    //////////v/////////FB Blocks////////////v/////////
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(sessionStateChanged:)
                                                 name:SMSSessionStateChangedNotification
                                               object:nil];
    
    [FBSession openActiveSessionWithAllowLoginUI:YES];
    
    if(FBSession.activeSession.isOpen){
        [[FBRequest requestForMe] startWithCompletionHandler:
         ^(FBRequestConnection *connection, NSDictionary<FBGraphUser> *user, NSError *error) {
             if (!error) {
                 //  self.userNameLabel.text = user.name;
                 // self.userProfileImage.profileID = [user objectForKey:@"id"];
                 NSLog(@"Facebook User: %@",user.name);
             }
         }];
    }
    //////////^/////////FB Blocks///////^//////////////
    
    
    //////////v/////////NSNotification Center Adds///////v//////////////

    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(activateCameraPreview:)
                                                 name:SMSActivatesCameraPreviewNotification
                                               object:nil];
    
    //////////^/////////NSNotification Center Adds///////^//////////////


    
}



#pragma mark -
#pragma Web View Methods

- (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType{
    
    
    NSLog(@"webview: %@",webView.description);
    
    return YES;
}




- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}
-(void)viewDidAppear:(BOOL)animated
{
    NSLog(@"ViewDID appear");
    
    
    
    //    sa1 = [[SSAudioManager alloc]init];
    //    [sa1 playSound:@"MODERATO"];
}
-(void) loadHTMLContent
{
    /**
     testing usig chris's code
     @"html/View/ViewFramework-test"
     */
    
    [_webView loadRequest: [NSURLRequest requestWithURL:[NSURL fileURLWithPath:[[NSBundle mainBundle] pathForResource:@"html/View/ViewFramework-test" ofType:@"html"] isDirectory:NO]]];
    [_webView setScalesPageToFit:YES];
    _webView.backgroundColor = [UIColor clearColor];
    
}

-(void) sayHello
{
    NSLog(@"HEllo");
}


-(void)activateCameraPreview:(NSNotification*)notification{

     if([self captureManager] == nil) {
              SSFiringManager *manager = [[SSFiringManager alloc] init];
              [self setCaptureManager:manager]; 
		
		if ([[self captureManager] setupSession]) {
            
            NSLog(@"Create video preview lay");
//
            // Create video preview layer and add it to the UI
			AVCaptureVideoPreviewLayer *newCaptureVideoPreviewLayer = [[AVCaptureVideoPreviewLayer alloc] initWithSession:[[self captureManager] session]];
            
            NSLog(@"newcapture:%@",newCaptureVideoPreviewLayer.session.description);
			UIView *view = [self videoPreviewView];
            NSLog(@"view det: %@",view.description);
			CALayer *viewLayer = [view layer];
			[viewLayer setMasksToBounds:YES];
			
			CGRect bounds = [view bounds];
			[newCaptureVideoPreviewLayer setFrame:bounds];
            
			
			[newCaptureVideoPreviewLayer setVideoGravity:AVLayerVideoGravityResizeAspectFill];
			[viewLayer insertSublayer:newCaptureVideoPreviewLayer below:[[viewLayer sublayers] objectAtIndex:0]];
			[self setCaptureVideoPreviewLayer:newCaptureVideoPreviewLayer];
            
			
            // Start the session. This is done asychronously since -startRunning doesn't return until the session is running.
			dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                
                [[[self captureManager] session] startRunning];
                
			});

            UIImageView *reticleView = [[UIImageView alloc] initWithFrame:CGRectMake(50, 50, 220, 220)];
            reticleView.image = [UIImage imageNamed:@"artilleryreticle3"];
            //[view addSubview:reticleView];
            [self.view addSubview:reticleView];
           // _webView.alpha=0;
           
             
		}

 }
}



#pragma mark - FBUserSettingsDelegate methods

- (void)sessionStateChanged:(NSNotification*)notification {
}

- (void)loginViewController:(id)sender receivedError:(NSError *)error{
    if (error) {
        UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:[NSString stringWithFormat:@"Error: %@",
                                                                     [SSAppDelegate FBErrorCodeDescription:error.code]]
                                                            message:error.localizedDescription
                                                           delegate:nil
                                                  cancelButtonTitle:@"OK"
                                                  otherButtonTitles:nil];
        [alertView show];
    }
}


@end