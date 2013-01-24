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
 "spartan-missile-strike://playSound?sound=EXPLOSION"
 */

//NSURL* url = [NSURL URLWithString:@"spartan-missile-strike://playSound?sound=Explosion"];
-(void)dispatchNativeBridgeEventsFromURL:(NSURL*)url
{
    // get NSString* from url (nsurl absolutestring method)
    NSString* urlString = [url absoluteString];
    //NSString* query = [urlString stringByReplacingOccurrencesOfString:@"spartan-missile-strike" withString:@""];
    
    //parse the schema and validate that it is spartan-missile-strike://
    NSString* methodToBeInvoked = [[NSString alloc] initWithContentsOfURL:url];
    
    // parse native-bridge method being invoked (i.e), playsound), store it in an NSString* called methodToBeInvoked
    if ([methodToBeInvoked length]==0)
    {
        [methodToBeInvoked nil];
    }
    else if (methodToBeInvoked == @"playSound")
    {
        //parse arguments out of the url to determine what sound effect we will play (JSON,query-string parameters...)
        NSString* string = @"";
        NSArray* contents = [string componentsSeparatedByString:@"?"];
        NSString* sound= [contents objectAtIndex:4];
        //once we have the sound-effect desired, call SSAudioMnagers playSound method
        [sa1 playSound:soundEffectThatWeParsedGoesHere];
         
    }
    
}


@end
