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
 NSURL looks like this
 "spartan-missile-strike://functionName [host]
 //:arguments(callbackIdentifier)"
 */

-(id)init
{
    self = [super init];
    sa1 = [[SSAudioManager alloc] init];
    return self;
}

-(BOOL)dispatchNativeBridgeEventsFromURL:(NSURL*)url
{
    /** parse out @"{sound:"MODERATO"}" getting an NSString* "MODERATO" then playSound on it
     spartan-missile-strike://functionName [host]
     :arguments(callbackIdentifier)"
     */
   // NSString* jsonString = @"spartan-missile-strike://functionName:arguments(callbackIdentifier)";
    NSData* jsonData = [[url absoluteString] dataUsingEncoding:NSUTF8StringEncoding];
    NSError* e;
    NSMutableArray* jsonList = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingMutableContainers error:&e];
    NSLog(@"argument is: %@", jsonList);
    
    [sa1 playSound:jsonData];
    
    
    NSString* scheme = [url scheme];
    if (![scheme isEqualToString:@"spartan-missile-strike"])
    {
        return YES;
    }
    
    NSString* functionName = [url host];
    
    
    // parse native-bridge method being invoked (i.e), playsound), store it in an NSString* called methodToBeInvoked
    if ([functionName isEqualToString:@"playSound"])
    {
        
        [sa1 playSound:@"MODERATO"];
        
    } 
    
}

//register for updates
// call back id


@end
