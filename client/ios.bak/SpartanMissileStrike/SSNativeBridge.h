//
//  SSNativeBridge.h
//  SpartanMissileStrike
//
//  Created by Sherif on 1/6/13.
//  Copyright (c) 2013 Group 2. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "SSAudioManager.h"
#import <CoreLocation/CoreLocation.h>
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

 
@interface SSNativeBridge : NSObject <UIWebViewDelegate>
{
  
    SSAudioManager* sa1;

}
-(BOOL)dispatchNativeBridgeEventsFromURL:(NSURL*)url; 
- (BOOL)webView: (UIWebView*)webView shouldStartLoadWithRequest: (NSURLRequest*)request navigationType: (UIWebViewNavigationType)navigationType;

-(void)vibrate;
@end
