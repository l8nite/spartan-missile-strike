//
//  SSUnitTests.m
//  SSUnitTests
//
//  Created by Sherif on 12/29/12.
//  Copyright (c) 2012 Jomana Sherif. All rights reserved.
//

#import "SSUnitTests.h"

@implementation SSUnitTests

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

- (void)testExample
{
    STFail(@"Unit tests are not implemented yet in SSUnitTests");
}

// Jomana

- (void)testSSPreference
{
 
    NSMutableArray *testingArg = [NSMutableArray arrayWithObjects: @"Sai", @"Jomana", @"Shaun", @"Chris"];
    STassertTrue([pared isEquaTo:expected], @"initialParserWithNSMutableArray failed to return the expected");
}



- (void)testTestFramework
{
    NSString *string1 = @"test";
    NSString *string2 = @"test";
    STAssertEquals(string1,
                   string2,
                   @"FAILURE");
    NSUInteger uint_1 = 4;
    NSUInteger uint_2 = 4;
    STAssertEquals(uint_1,
                   uint_2,
                   @"FAILURE");
}



// Test casses using Assert

/**
STAssertEqualObjects asserts two Cocoa objects are equal.
STAssertEqual asserts two variables of a primitive data type, such as integers, are equal.
STAssertEqualsWithAccuracy asserts two floating-point variables are equal. This assertion allows you to deal with small inaccuracies in floating-point arithmetic.
STAssertFalse asserts a condition is false.
STAssertFalseNoThrow asserts a condition is false and no exceptions are thrown.
STAssertNil asserts a pointer is nil.
STAssertNoThrow asserts no exceptions are thrown.
STAssertNoThrowSpecific asserts no exceptions of a specific class are thrown.
STAssertNoThrowSpecificNamed asserts a specific exception is not thrown.
STAssertNotNil asserts a pointer is not nil.
STAssertThrows asserts an exception is thrown.
STAssertThrowsSpecific asserts an exception of a specific class is thrown.
STAssertThrowsSpecificNamed asserts a specific exception is thrown.
STAssertTrue asserts a condition is true.
STAssertTrueNoThrow asserts a condition is true and no exceptions are thrown.
*/
@end
