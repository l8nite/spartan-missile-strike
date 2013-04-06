//
//  SSAudioManager.m
//  SpartanMissileStrike
//
//  Created on 3/12/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import "SSAudioManager.h"

@implementation SSAudioManager

-(id)init
{
    if (self = [super init]) {
        [self _initAudioPlayers];
    }
    
    return self;
}

-(void)_initAudioPlayers
{
    filenameForSoundId = [NSDictionary dictionaryWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"sounds" ofType:@"plist"]];
    playerForSoundId = [[NSMutableDictionary alloc] init];

    for (NSString *key in filenameForSoundId)
    {
        NSDictionary *soundInfo = [filenameForSoundId objectForKey:key];
        NSString *resourceName = [soundInfo objectForKey:@"ResourceName"];
        NSString *resourceType = [soundInfo objectForKey:@"ResourceType"];
        NSURL *resourceURL = [[NSBundle mainBundle] URLForResource:resourceName withExtension:resourceType];

        AVAudioPlayer *player = [[AVAudioPlayer alloc] initWithContentsOfURL:resourceURL error:nil];
        [playerForSoundId setObject:player forKey:key];
    }
}

-(void)playSound:(NSString *)soundIdentifier loopCount:(NSInteger)loops
{
    AVAudioPlayer *player = (AVAudioPlayer *)[playerForSoundId objectForKey:soundIdentifier];
    NSAssert(player != nil, @"soundIdentifier is not recognized");
    [player setNumberOfLoops:loops];
    [player play];
}

-(void)stopSound:(NSString *)soundIdentifier
{
    AVAudioPlayer *player = (AVAudioPlayer *)[playerForSoundId objectForKey:soundIdentifier];
    NSAssert(player != nil, @"soundIdentifier is not recognized");
    [player stop];
}

@end
