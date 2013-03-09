//
//  SSNativeBridge.m
//  SpartanMissileStrike
//
//  Created by Sherif on 1/6/13.
//  Copyright (c) 2013 Group 2. All rights reserved.
//

#import "SSNativeBridge.h"
#import "SSAppDelegate.h"
#import <math.h>


@implementation SSNativeBridge
/**
 "spartan-missile-strike://functionName[calledHOST]:arguments(callbackIdentifier )"
 schema://hostname/path?key=value1&key2=value2
 /?:&
 */
//NO MESSING WITH UI

-(id)init
{
    self = [super init];
    sa1 = [[SSAudioManager alloc] init];
    return self;
}

-(BOOL)dispatchNativeBridgeEventsFromURL:(NSURL*)url
{
    /**
     Bails out if not spartan-missile-strike
     */
    NSLog(@"DISPATCHING!!!");
    NSString* scheme = [url scheme];
    
    NSLog(@"scheme: %@",scheme);

    if (![scheme isEqualToString:@"spartan-missile-strike"])
    {
        return YES;
    }
    /// parsing the encoded string into a JSON object
    NSString* query= [url query];
    NSLog(@"query: %@",query);

    NSArray* parameters= [query componentsSeparatedByString:@"="];
    NSString* arguments= [parameters objectAtIndex:1];
    NSString* decoded = [arguments stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    NSData* dDecoded = [decoded dataUsingEncoding:NSUTF8StringEncoding];
    NSString* functionName = [url host];
    
    
    NSLog(@"function name: %@",functionName);
    if ([functionName isEqualToString:@"getCurrentLocation"])
    {
        SSAppDelegate *appDelegate = (SSAppDelegate *)[[UIApplication sharedApplication] delegate];
        float currentLatitude = appDelegate.locationManager.location.coordinate.latitude;
        float currentLongitude = appDelegate.locationManager.location.coordinate.latitude;
        NSLog(@"Current Device location %f %f",currentLatitude,currentLongitude);
        

    }   else if ([functionName isEqualToString:@"playSound"])
    {
        NSError* e;
        NSDictionary* jsonObject = [NSJSONSerialization JSONObjectWithData:dDecoded options:0 error:&e];
        NSLog(@"jsonOBJ %@",jsonObject);
        NSString *soundIDKey = [jsonObject valueForKey:@"soundID"];
        [sa1 playSound:soundIDKey];// PULL IT OUT OF THE JSON OBJECT
        
    }
        else if ([functionName isEqualToString:@"showFireMissileScreen"])
    {
        NSLog(@"showscreen");
        NSString *nativeAction = @"showFireMissileScreen";
        [[NSNotificationCenter defaultCenter] postNotificationName:SMSActivatesCameraPreviewNotification object:nativeAction];
        //syncronously location gets updated
               
        
    }   else if([functionName isEqualToString:@"fireMissile"])
    {
        
        NSLog(@"Get Device Attitude");
    //Motion manager as well
        SSAppDelegate *appDelegate = (SSAppDelegate *)[[UIApplication sharedApplication] delegate];
        float currentYaw = appDelegate.sharedMotionManager.deviceMotion.attitude.yaw*180/M_PI;
        float currentPitch = appDelegate.sharedMotionManager.deviceMotion.attitude.pitch* 180/M_PI;
        float currentRoll = appDelegate.sharedMotionManager.deviceMotion.attitude.roll* 180/M_PI;
    
        NSLog(@"yaw is %f",currentYaw);
        NSLog(@"pitch is %f",currentPitch);
        NSLog(@"roll is %f",currentRoll);
    
    }else if ([functionName isEqualToString:@"vibrate"])
    {
        /////Apple has locked the API to set vibrate length to preserve battery
        ///Seeting vibrate duration is not supported without heavy lifting
        
        AudioServicesPlaySystemSound (kSystemSoundID_Vibrate);
        
    }
    
    ////NSLog(@"I am a spartan missile strike handler");
    return NO;
    
}






/**
 Vibration
 */
-(void)vibrate
{
    AudioServicesPlaySystemSound(kSystemSoundID_Vibrate);
    
}
- (BOOL)webView: (UIWebView*)webView shouldStartLoadWithRequest: (NSURLRequest*)request navigationType: (UIWebViewNavigationType)navigationType
{
    NSLog(@"entered webview should...");
    
    return [self dispatchNativeBridgeEventsFromURL:[request URL]];
}



@end
