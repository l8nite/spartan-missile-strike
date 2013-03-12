//
//  SSAudioManagerMocked.m
//  SpartanMissileStrike
//
//  Created by Sherif on 1/19/13.
//  Copyright (c) 2013 Group 2. All rights reserved.
//

#import "SSAudioManagerMocked.h"


@implementation SSAudioManagerMocked
// setting up a boolean
bool  wasPlayed= FALSE;

NSString* urlPassedToMe;

// init
//-->AVAudioPlayer* player = [[AVAudioPlayer alloc] initWithContentsOfURL:wasPlayed error:nil];


// play
-(void)testPlaySound
{
    // setting boolean to true it played
    wasPlayed = TRUE;
}

// get url that is passed

// get was played
@end
