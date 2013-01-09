//
//  SSPreferenceManagerTests.m
//  SpartanMissileStrike
//
//  Created by Sherif on 1/3/13.
//  Copyright (c) 2013 Group 2. All rights reserved.
//

#import "SSPreferenceManagerTests.h"

@implementation SSPreferenceManagerTests
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


-(void)testPreferences
{
    SSPreferenceManager* sp1 = [[SSPreferenceManager alloc] init];
    STAssertNotNil(sp1,@"SSPreferenceManager initialization test");
}

-(void)testSetPreference
{
    SSPreferenceManager* sp1 = [[SSPreferenceManager alloc] init];
    [sp1 setPreference:@"goose" forKey: @"bird"];
    
    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    //getting value for bird
    NSString* actual = [defaults stringForKey:@"bird"];
    STAssertEqualObjects(@"goose",actual , @"set prefence worked");
     
}

-(void)testPreference
{
    SSPreferenceManager* sp1 = [[SSPreferenceManager alloc] init];
    
    NSUserDefaults* defaults  = [NSUserDefaults standardUserDefaults];
    //set a value, and get it from the preference manger
    [defaults setObject:@"tortilla" forKey: @"chip"]; // store in the phone
    NSString* actual = [sp1 preferenceForKey:@"chip"]; // got it from our method
    STAssertEqualObjects(@"tortilla", actual, @"get preferences worked");
    

}
@end
