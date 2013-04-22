//
//  SSNativeBridge.h
//  SpartanMissileStrike
//
//  Created on 3/11/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol SSNativeBridgeDelegate;

@interface SSNativeBridge : NSObject
{
    __weak id<SSNativeBridgeDelegate> _delegate;
    __weak UIWebView *_webView;
}

@property (weak) id<SSNativeBridgeDelegate> delegate;
@property (weak) UIWebView* webView;

-(id)initWithWebView:(UIWebView*)webView andDelegate:(id<SSNativeBridgeDelegate>)delegate;

-(void)callbackWithArray:(NSArray*)result forFunction:(NSString*)function withArguments:(NSDictionary*)arguments;

-(void)callbackWithDictionary:(NSDictionary*)result forFunction:(NSString*)function withArguments:(NSDictionary*)arguments;

-(void)callbackWithString:(NSString*)result forFunction:(NSString*)function withArguments:(NSDictionary*)arguments;

@end

@interface SSNativeBridge (UIWebViewDelegate) <UIWebViewDelegate>
@end