//
//  SSNativeBridge.m
//  SpartanMissileStrike
//
//  Created by Sherif on 1/6/13.
//  Copyright (c) 2013 Group 2. All rights reserved.
//

#import "SSNativeBridge.h"

@implementation SSNativeBridge

/**
 "spartan-missile-strike://functionName[calledHOST]:arguments(callbackIdentifier)"
 schema://hostname/path?key=value1&key2=value2
 /?:&
 */

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
    NSString* scheme = [url scheme];
    if (![scheme isEqualToString:@"spartan-missile-strike"])
    {
        return YES;
    }
    NSString* query= [url query];
    NSArray* parameters= [query componentsSeparatedByString:@"="];
    NSString* arguments= [parameters objectAtIndex:1];
    NSString* decoded = [arguments stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    NSData* dDecoded = [decoded dataUsingEncoding:NSUTF8StringEncoding];
    NSError* e;
    
    NSDictionary* jsonObject = [NSJSONSerialization JSONObjectWithData:dDecoded options:0 error:&e];
    
    
    
    NSString* functionName = [url host];
    if ([functionName isEqualToString:@"playSound"])
    {
        for (NSDictionary* result in jsonObject)
        {
            NSString* results= [jsonObject objectForKey:@"sound"];
            [sa1 playSound:results];
        }
        
    }
    return NO;
    
}

-(void) loadHTMLContent
{
    UIWebView* HTMLs = [[UIWebView alloc]init];
    [HTMLs loadRequest: [NSURLRequest requestWithURL:[NSURL fileURLWithPath:[[NSBundle mainBundle] pathForResource:@"ViewFramework-test" ofType:@"html"] isDirectory:NO]]];
    [HTMLs setScalesPageToFit:YES];
    HTMLs.backgroundColor = [UIColor clearColor];
    
}




@end
