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
    // Set AudioSession category to "Ambient" to allow other application's audio to play
    [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryAmbient error:nil];
    [[AVAudioSession sharedInstance] setActive:YES error:nil];

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

-(void)playSound:(NSString *)soundIdentifier loopCount:(NSInteger)loops inForeground:(BOOL)inForeground
{
    if (!inForeground) {
        UInt32 otherAudioIsPlaying;
        UInt32 size = sizeof(otherAudioIsPlaying);
        AudioSessionGetProperty(kAudioSessionProperty_OtherAudioIsPlaying, &size, &otherAudioIsPlaying);
		
        if (otherAudioIsPlaying){
            NSLog(@"background music already playing, ignoring request to playSound('%@')", soundIdentifier);
            return;
        }
    }

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
