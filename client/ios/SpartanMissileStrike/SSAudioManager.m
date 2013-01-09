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
//    //get the path from the helper
//    NSString* path =[self pathForSoundIdentifier:identifier];
//    if (path == nil)
//    {
//        return ;
//    }
//    
//     
//    //play the sound
//    NSURL* url = [NSURL fileURLWithPath:path];
//    NSError* err;
//    AVAudioPlayer* player = [[AVAudioPlayer alloc]initWithContentsOfURL:url error:&err];
//    player.numberOfLoops=-1;
//    [player play];
    
    
    NSURL* url = [NSURL fileURLWithPath:[NSString stringWithFormat:@"%@/helicopter.mp3" , [[NSBundle mainBundle] resourcePath]]];
    AVAudioPlayer* player = [[AVAudioPlayer alloc]initWithContentsOfURL:url error:nil];
        player.numberOfLoops=-1;
       [player play];

}

-(void)audioPlayerDidFinishPlaying:(AVAudioPlayer *)player successfully:(BOOL)flag
{
    return;
}

@end
 

