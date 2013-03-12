//
//  SSNativeBridge.m
//  SpartanMissileStrike
//
//  Created by Shaun Guth on 3/11/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import "SSNativeBridge.h"
#import "NSString+CaseInsensitiveComparison.h"

@implementation SSNativeBridge

-(BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
{
    NSURL *url = [request URL];
    NSString *urlScheme = [url scheme];

    if (![urlScheme isEqualIgnoringCase:@"spartan-missile-strike"]) {
        return YES;
    }
    
    NSLog(@"Received native bridge request: %@", url);

    return NO;
}

@end
