//
//  SSAudioManager.m
//  Spartan Missile Strike
//
//  Created by Sherif on 12/22/12.
//  Copyright (c) 2012 Jomana Sherif. All rights reserved.
//

#import "SSAudioManager.h"

@implementation SSAudioManager

@synthesize volumeControl;

-(void)viewDidLoad
{
    [super viewDidLoad];
    NSURL *url = [NSURL fileURLWithPath:[[NSBundle mainBundle] pathForResource:@"ADELE - Skyfall" ofType: @"mp3"]];
    
    NSError *error;
    audioPlayer = [[AVAudioPlayer alloc] initWithContentsOfURL:url error:&error];
    if (error)
    {
        NSLog(@"Error in audioPlayer: %@",
              [error localizedDescription]);
    } else {
        audioPlayer.delegate = self;
        [audioPlayer prepareToPlay];
    }
}

- (void)viewDidUnload {
    // Release any retained subviews of the main view.
    // e.g. self.myOutlet = nil;
    audioPlayer = nil;
    volumeControl = nil;
}


-(void)playAudio
{
    [audioPlayer play];
    
}

-(void) stopAudio
{
    [audioPlayer stop];
}

-(void)adjustVolume
{
    if (audioPlayer !=nil)
    {
        audioPlayer.volume = volumeControl.value;
    }
}



// notifiations relating to the playback
-(void)audioPlayerDidFinishPlaying:
(AVAudioPlayer *)player successfully:(BOOL)flag
{
}
-(void)audioPlayerDecodeErrorDidOccur:
(AVAudioPlayer *)player error:(NSError *)error
{
}
-(void)audioPlayerBeginInterruption:(AVAudioPlayer *)player
{
}
-(void)audioPlayerEndInterruption:(AVAudioPlayer *)player
{
}
@end
