//
//  SSNativeBridge.h
//  SpartanMissileStrike
//
//  Created by Shaun Guth on 3/11/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol SSNativeBridgeDelegate;

@interface SSNativeBridge : NSObject <UIWebViewDelegate>
{
    __weak id<SSNativeBridgeDelegate> _delegate;
    __weak UIWebView *_webView;
}

@property (weak) id<SSNativeBridgeDelegate> delegate;
@property (weak) UIWebView* webView;

-(void)callbackWithResult:(NSString*)result forFunction:(NSString*)function withArguments:(NSDictionary*)arguments;

@end