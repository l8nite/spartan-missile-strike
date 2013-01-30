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
    /**
     setting up the querry
     getting what is after the question mark
     */
    NSString* query = [url query];
 
    
    /**
     parsing after the question mark with one argument
     getting the arguments
     gettingn the key and the value
     playing on the value
     */
    NSString* functionName = [url host]; 
    if ([functionName isEqualToString:@"playSound"])
    {
        /**
         I have arguments=%7Bidentifier%3A%20%22MODERATO%22%7D
         */
        NSMutableArray* components = [query componentsSeparatedByString:@"="];
        /**
         arguments
         %7Bidentifier%3A%20%22MODERATO%22%7D
         */
        
        NSMutableDictionary* parameters = [[NSMutableDictionary alloc] init];
        
        for (int i=0; i<[components count]; i++)
        {
            [parameters setObject:[components objectAtIndex:i] forKey:@"firstone"];
        }
        
                 
        NSData* jsonData = [[components objectAtIndex:1]  dataUsingEncoding:NSUTF8StringEncoding];
        NSError* e;
        NSDictionary* jsonList = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingMutableContainers error:&e];
        NSLog(@"parameters are : %@", jsonList);
        
        [sa1 playSound:jsonData ];
       
        // getting the sound idetifer for the sound playSound json arguments
        
        
    }
    /**
     more than one argument 
     */
    
}



@end
