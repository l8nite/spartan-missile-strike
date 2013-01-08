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
    NSString* path =[[NSBundle mainBundle] pathForResource:@"helicopter" ofType:@"mp3"];
    
     
    theAudio = [[AVAudioPlayer alloc] initWithContentsOfURL:
                [NSURL fileURLWithPath:path] error:NULL];
    theAudio.delegate = self;
    [theAudio play];
}

-(void)playSoundEffect
{
    NSString* path =[[NSBundle mainBundle] pathForResource:@"mlaunch" ofType:@"mp3"];
    
    
    theAudio = [[AVAudioPlayer alloc] initWithContentsOfURL:
                [NSURL fileURLWithPath:path] error:NULL];
    theAudio.delegate = self;
    [theAudio play];
}
//-(void)muteSoundEffect
//{
//    
//}
//

//-(void)muteBackgroundMusic
//{
//    
//}

//-(void)playBackgroundMusic
//{
//    NSString* path =[[NSBundle mainBundle] pathForResource:@"skyfall" ofType:@"mp3"];
//    
//    
//    theAudio = [[AVAudioPlayer alloc] initWithContentsOfURL:
//                [NSURL fileURLWithPath:path] error:NULL];
//    theAudio.delegate = self;
//    [theAudio play];
//    
//}


-(IBAction)play{
    [theAudio play];
    
}
-(IBAction)stop{
    [theAudio stop];
}
-(IBAction)pause{
    [theAudio pause]; 
}

@end
 

