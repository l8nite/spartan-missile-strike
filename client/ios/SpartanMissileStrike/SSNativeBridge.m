//
//  SSNativeBridge.m
//  SpartanMissileStrike
//
//  Created by Shaun Guth on 3/11/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import "SSNativeBridge.h"
#import "NSString+CaseInsensitiveComparison.h"
#import "SSNativeBridgeDelegate.h"

@implementation SSNativeBridge

@synthesize delegate;
static SSNativeBridge *singleton;

+(void)initialize
{
    static BOOL initialized = NO;

    if (!initialized) {
        initialized = YES;
        singleton = [[SSNativeBridge alloc] init];
    }
}

+(SSNativeBridge *)sharedInstance
{
    return singleton;
}

-(BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
{
    NSURL *url = [request URL];
    NSString *urlScheme = [url scheme];

    if (![urlScheme isEqualIgnoringCase:@"spartan-missile-strike"]) {
        return YES;
    }
       
    NSString *nativeBridgeFunction = [url host];

    // parse query parameters into a dictionary
    NSMutableDictionary *parameters = [NSMutableDictionary dictionary];
    NSArray *keyValuePairs = [[url query] componentsSeparatedByString:@"&"];
    for (NSString *keyValuePair in keyValuePairs) {
        NSArray *components = [keyValuePair componentsSeparatedByString:@"="];
        NSString *key = [[components objectAtIndex:0] stringByReplacingPercentEscapesUsingEncoding:NSASCIIStringEncoding];
        NSString *value = [[components objectAtIndex:1] stringByReplacingPercentEscapesUsingEncoding:NSASCIIStringEncoding];
        [parameters setObject:value forKey:key];
    }
    
    // get 'arguments' parameter and deserialize JSON (if present)
    NSString *argumentsParam = [parameters objectForKey:@"arguments"];
    NSDictionary *nativeBridgeFunctionArguments = nil;
    
    if (argumentsParam != nil) {
        nativeBridgeFunctionArguments = [NSJSONSerialization JSONObjectWithData:[argumentsParam dataUsingEncoding:NSUTF8StringEncoding] options:0 error:nil];
    }
    
    // dispatch event to delegate
    [delegate nativeBridgeFunction:nativeBridgeFunction withArguments:nativeBridgeFunctionArguments];

    return NO;
}


@end
