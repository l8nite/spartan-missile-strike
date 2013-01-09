//
//  SSAudioManagerTests.m
//  SpartanMissileStrike
//
//  Created by Sherif on 1/3/13.
//  Copyright (c) 2013 Group 2. All rights reserved.
//

#import "SSAudioManagerTests.h"

@implementation SSAudioManagerTests

- (void)setUp
{
    [super setUp];
    
    // Set-up code here.
}

- (void)tearDown
{
    // Tear-down code here.
    
    [super tearDown];
}

-(void)testInitialization
{ 
    SSAudioManager* sa1 = [[SSAudioManager alloc] init];
    STAssertNotNil(sa1,@"SSAudioManager initialization test");
    
}

@end
