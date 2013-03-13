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

@synthesize delegate = _delegate;
@synthesize webView = _webView;

-(id)initWithWebView:(UIWebView*)webView andDelegate:(id<SSNativeBridgeDelegate>)delegate
{
    if (self = [super init]) {
        _delegate = delegate;
        _webView = webView;
        [_webView setDelegate:self];
    }

    return self;
}

-(void)callbackWithResult:(NSString*)result forFunction:(NSString*)function withArguments:(NSDictionary*)arguments
{
    NSNumber *callbackIdentifier = (NSNumber*)[arguments objectForKey:@"identifier"];
    NSAssert(callbackIdentifier != nil, @"callback attempted, but no callback identifier present");
    
    NSString *callbackJS = [NSString stringWithFormat:@"NativeBridge.callback(%d, '%@')", [callbackIdentifier integerValue], result];

    if ([_webView stringByEvaluatingJavaScriptFromString:callbackJS] == nil) {
        NSLog(@"Error executing callback: %@", callbackJS);
    }
}

@end

@implementation SSNativeBridge (UIWebViewDelegate)

-(BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
{
    NSURL *url = [request URL];
    NSString *urlScheme = [url scheme];
    
    // NSLog(@"%@", url);
    
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
    [_delegate nativeBridgeFunction:nativeBridgeFunction withArguments:nativeBridgeFunctionArguments];
    
    return NO;
}

@end
