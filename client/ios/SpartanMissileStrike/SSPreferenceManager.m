//
//  SSPreferenceManager.m
//  SpartanMissileStrike
//
//  Created  on 3/13/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import "SSPreferenceManager.h"

@implementation SSPreferenceManager

@synthesize userDefaults;

-(id)init
{
    if (self = [super init]) {
        userDefaults = [NSUserDefaults standardUserDefaults];
    }

    return self;
}

-(void)setPreferences:(NSDictionary*)preferences withCompletionHandler:(void (^)(BOOL success))completionHandler
{
    for (NSString *key in preferences) {
        [userDefaults setObject:[preferences objectForKey:key] forKey:key];
    }

    completionHandler(YES);
}

-(void)getPreferences:(NSArray*)preferences withCompletionHandler:(void (^)(NSDictionary* preferences))completionHandler
{
    completionHandler([userDefaults dictionaryWithValuesForKeys:preferences]);    
}

@end
