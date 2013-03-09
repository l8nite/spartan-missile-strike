//
//  SSPreferenceManager.m
//  Spartan Missile Strike
//
//  Created by Sherif on 12/22/12.
//  Copyright (c) 2012 Jomana Sherif. All rights reserved.
//

#import "SSPreferenceManager.h"
  
@implementation SSPreferenceManager
 


-(id)init{
    self = [super init];
       
    userDefault = [NSUserDefaults standardUserDefaults ];
    return self;
}

-(void)setPreference: (NSString *)value forKey: (NSString *)key
{
    [userDefault setObject:value forKey:key];
}

-(NSString *)preferenceForKey: (NSString *) key
{
   return [userDefault stringForKey:key];
}




@end

 
 