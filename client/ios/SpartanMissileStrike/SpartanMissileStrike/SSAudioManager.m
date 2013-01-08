//
//  SSAudioManager.m
//  SpartanMissileStrike
//
//  Created by Sherif on 1/3/13.
//  Copyright (c) 2013 Group 2. All rights reserved.
//

#import "SSAudioManager.h"

@implementation SSAudioManager
// mulitple sounds, muting , volume
// methods: play sound, mute sound effect, mute backgorund music, play background music
-(id)init{
    self = [super init];
    return self;
}




-(void)playSoundLaunch
{
    NSString* path =[[NSBundle mainBundle] pathForResource:@"skyfall" ofType:@"mp3"];
    
    if(theAudio)[theAudio nil];
    theAudio = [[AVAudioPlayer alloc] initWithContentsOfURL:(NSURLfileURLWithPath:path) error:null];
    theAudio.delegate = self;
    [theAudio play];
}

-(void)stopSoundLaunch
{
    
}


-(void)playSoundEffect
{
    
}
-(void)muteSoundEffect
{
    
}


-(void)muteBackgroundMusic
{
    
}

-(void)playBackgroundMusic
{
    
}

// [player pause]; [player stop];
@end
