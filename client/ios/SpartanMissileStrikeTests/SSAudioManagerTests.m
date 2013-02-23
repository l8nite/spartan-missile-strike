//
//  SSAudioManagerTests.m
//  SpartanMissileStrike
//
//  Created by Sherif on 1/3/13.
//  Copyright (c) 2013 Group 2. All rights reserved.
//

#import "SSAudioManagerTests.h"
#import  <AVFoundation/AVFoundation.h>
#import <OCMock/OCMock.h>

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
    SSAudioManager* sa1 = [SSAudioManager alloc] ;
    STAssertNotNil(sa1,@"SSAudioManager initialization test");
    
    id mockInstance = [OCMockObject partialMockForObject:sa1];
    
    id mockedAVAudioPlayer= [OCMockObject mockForClass:[AVAudioPlayer class]];
    NSURL* url = [[NSBundle mainBundle] URLForResource: @"shared/audio/Moderato"  withExtension:@"mp3"];
   (void) [[mockedAVAudioPlayer expect] initWithContentsOfURL:url error:nil];
    [[[mockInstance stub] andReturn:mockedAVAudioPlayer] createAVAudioPlayer];
    (void)[sa1 init];
    
    [mockedAVAudioPlayer verify];

    
}

-(void)testPlaySound
{
    
    SSAudioManager* sa1 = [SSAudioManager alloc] ;
    id mockInstance = [OCMockObject partialMockForObject:sa1];
    
    id mockedAVAudioPlayer= [OCMockObject mockForClass:[AVAudioPlayer class]];
    [(AVAudioPlayer*)[mockedAVAudioPlayer expect] play];
    //injection code
    [[[mockInstance stub] andReturn:mockedAVAudioPlayer] createAVAudioPlayer];
    NSURL* url = [[NSBundle mainBundle] URLForResource: @"shared/audio/Moderato"  withExtension:@"mp3"];
   (void) [[[mockedAVAudioPlayer stub] andReturn:mockedAVAudioPlayer] initWithContentsOfURL:url error:nil];
   (void) [sa1 init];
    [sa1 playSound:@"MODERATO"];
    
    [mockedAVAudioPlayer verify];
    
        
    
   }

  

@end



























