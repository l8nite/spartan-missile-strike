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
    if (![scheme isEqualToString:@"spartan-missile-strike"])
    {
        return YES;
    }
    /// parsing the encoded string into a JSON object
        NSString* query= [url query];
        NSArray* parameters= [query componentsSeparatedByString:@"="];
        NSString* arguments= [parameters objectAtIndex:1];
        NSString* decoded = [arguments stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
        NSData* dDecoded = [decoded dataUsingEncoding:NSUTF8StringEncoding];
        NSError* e;
        NSDictionary* jsonObject = [NSJSONSerialization JSONObjectWithData:dDecoded options:0 error:&e];
        NSLog(@"jsonOBJ %@",jsonObject);
    
    NSString* functionName = [url host];
    if ([functionName isEqualToString:@"playSound"])
    {
        NSString *soundIDKey = [jsonObject valueForKey:@"soundID"];
        
        
        [sa1 playSound:soundIDKey];// PULL IT OUT OF THE JSON OBJECT
        
//                for (NSDictionary* result in jsonObject)
//                {
//                    NSString* results= [jsonObject objectForKey:@"sound"];
//                    [sa1 playSound:results];
//                }
        
    }
    NSLog(@"I am a spartan missile strike handler");
    return NO;
    
}




- (BOOL)webView: (UIWebView*)webView shouldStartLoadWithRequest: (NSURLRequest*)request navigationType: (UIWebViewNavigationType)navigationType
{
    NSLog(@"entered webview should...");
    
    return [self dispatchNativeBridgeEventsFromURL:[request URL]];
}



@end
