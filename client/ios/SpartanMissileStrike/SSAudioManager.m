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


-(NSString*)pathForSoundIdentifier:(NSString*)identifier
{
    NSString* path = nil;
 
    if ([identifier compare:@"HELICOPTER"] == NSOrderedSame)
    {
        path =  [[NSBundle mainBundle] pathForResource:@"helicopter" ofType: @"mp3"];
    }

    return path;
}

-(void)playSound:(NSString*)identifier
{
    
    NSURL* url = [NSURL fileURLWithPath:[NSString stringWithFormat:@"%@/Moderato.mp3" , [[NSBundle mainBundle] resourcePath]]];
     player = [[AVAudioPlayer alloc]initWithContentsOfURL:url error:nil];
        player.numberOfLoops=-1;
       [player play];

}

-(void)audioPlayerDidFinishPlaying:(AVAudioPlayer *)player successfully:(BOOL)flag
{
    return;
}

@end
 

