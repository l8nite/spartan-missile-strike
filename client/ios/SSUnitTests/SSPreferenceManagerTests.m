//
//  SSPreferenceManagerTests.m
//  Spartan Missile Strike
//
//  Created by Sherif on 1/3/13.
//  Copyright (c) 2013 Jomana Sherif. All rights reserved.
//

#import "SSPreferenceManagerTests.h"
#import "SSPreferenceManager.h"
@implementation SSPreferenceManagerTests

- (void)testInitialization
{
    SSPreferenceManager* sp1 = [[SSPreferenceManager alloc] init];
    
    STAssertNotNil(sp1,@"SSPreferencemanger initialized correctly") ;
}

@end
