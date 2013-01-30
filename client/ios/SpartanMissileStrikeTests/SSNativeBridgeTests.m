//
//  SSNativeBridgeTests.m
//  SpartanMissileStrike
//
//  Created by Sherif on 1/11/13.
//  Copyright (c) 2013 Group 2. All rights reserved.
//

#import "SSNativeBridgeTests.h"
#import "SSNativeBridge.h"

@implementation SSNativeBridgeTests

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


-(void)testdispatchNativeBridgeEventsFromURL
{
    SSNativeBridge* na1 = [[SSNativeBridge alloc] init];
    NSURL* url = [NSURL URLWithString:@"spartan-missile-strike://playSound?arguments=%7Bidentifier%3A%20%22MODERATO%22%7D"];
    [na1 dispatchNativeBridgeEventsFromURL:url];
    
    STAssertNotNil(na1,@"Dispatch Native Bridge Events From URL initialization test");

}
@end
