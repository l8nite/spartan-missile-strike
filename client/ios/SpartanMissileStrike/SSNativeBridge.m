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

static SSNativeBridge *sharedSingleton;

+(void)initialize
{
    static BOOL initialized = NO;

    if (!initialized) {
        initialized = YES;
        sharedSingleton = [[SSNativeBridge alloc] init];
    }
}

+(SSNativeBridge *)sharedInstance
{
    return sharedSingleton;
}

-(id)init
{
    if (self = [super init]) {
        delegates = [[NSDictionary alloc] init];
    }

    return self;
}

-(void)addDelegate:(id <SSNativeBridgeDelegate>)delegate forFunction:(NSString *)function
{
    NSAssert([delegates objectForKey:function] != nil, @"addDelegate called twice for same function");
    [delegates setValue:delegate forKey:function];
}

-(BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
{
    NSURL *url = [request URL];
    NSString *urlScheme = [url scheme];

    if (![urlScheme isEqualIgnoringCase:@"spartan-missile-strike"]) {
        return YES;
    }
       
    NSString *nativeBridgeFunction = [url host];
    
    // if we don't have a delegate registered for this request, ignore it
    if ([delegates objectForKey:nativeBridgeFunction] == nil) {
        NSLog(@"Ignoring NativeBridge '%@', no delegate registered", nativeBridgeFunction);
        return NO;
    }
    
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
    
    NSLog(@"Dispatching NativeBridge '%@' with arguments: %@", nativeBridgeFunction, nativeBridgeFunctionArguments);
    
    // dispatch event to delegate
    [(id<SSNativeBridgeDelegate>)[delegates objectForKey:nativeBridgeFunction] nativeBridgeFunction:nativeBridgeFunction withArguments:nativeBridgeFunctionArguments];

    return NO;
}


@end
