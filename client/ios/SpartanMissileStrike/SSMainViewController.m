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

@implementation SSMainViewController
@synthesize webView = _webView;
@synthesize nativeBridge;
@synthesize session,firingViewController;

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    nativeBridge = [[SSNativeBridge alloc]init];    
    [_webView setDelegate:nativeBridge];
    
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
    
    
    ////Setting up a UIToolbar and Camera View/////
   
}

#pragma mark -
#pragma CameraController Methods


//-(IBAction)callForFireMission:(id)sender{
//   [self showImagePicker:UIImagePickerControllerSourceTypeCamera];
//}
//
//
//- (void)showImagePicker:(UIImagePickerControllerSourceType)sourceType
//{
//    
//    if ([UIImagePickerController isSourceTypeAvailable: UIImagePickerControllerSourceTypeCamera])
//    {
//        NSLog(@"Image");
//
//        [firingViewController setupImagePicker:sourceType];
//        [self presentViewController:self.firingViewController.imagePickerController animated:YES completion:nil];
//    }
//}


//- (IBAction)cameraAction:(id)sender
//{
//    [self showImagePicker:UIImagePickerControllerSourceTypeCamera];
//}


#pragma mark -
#pragma mark OverlayViewControllerDelegate

// as a delegate we are being told a picture was taken
- (void)didTakePicture:(UIImage *)picture
{
//    [self.capturedImages addObject:picture];
}

// as a delegate we are told to finished with the camera
- (void)didFinishWithCamera
{
    [self dismissViewControllerAnimated:YES completion:nil];
 
    
//    if ([self.capturedImages count] > 0)
//    {
//        if ([self.capturedImages count] == 1)
//        {
//            // we took a single shot
//            [self.imageView setImage:[self.capturedImages objectAtIndex:0]];
//        }
//        else
//        {
//            // we took multiple shots, use the list of images for animation
//            self.imageView.animationImages = self.capturedImages;
//            
//            if (self.capturedImages.count > 0)
//                // we are done with the image list until next time
//                [self.capturedImages removeAllObjects];
//            
//            self.imageView.animationDuration = 5.0;    // show each captured photo for 5 seconds
//            self.imageView.animationRepeatCount = 0;   // animate forever (show all photos)
//            [self.imageView startAnimating];
//        }
//    }
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




/*if ([[url scheme] isEqualToString:@"js2objc"]) {
    // remove leading / from path
    [self helloFromJavaScript:[[url path] substringFromIndex:1]];
    return NO; // prevent request
} else {
    return YES; // allow request
}*/


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