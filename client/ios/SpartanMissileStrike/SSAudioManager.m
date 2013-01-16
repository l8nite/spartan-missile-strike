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
    
    filenameForSound = [NSDictionary dictionaryWithContentsOfFile:[[NSBundle mainBundle] pathForResource: @"sounds" ofType: @"plist"] ];
    playerForSound = [[NSMutableDictionary alloc] init];
    
    for (NSString* key in filenameForSound)
    {
        NSURL* url = [[NSBundle mainBundle] URLForResource: [filenameForSound objectForKey:key]  withExtension:@"mp3"];
        AVAudioPlayer* player = [[AVAudioPlayer alloc] initWithContentsOfURL:url error:nil];
        [playerForSound setObject:player forKey:key];
        
    }
    return self;
}

-(void)playSound:(NSString*)identifier
{
    // get the nsobject pointer from playerforsound dictionary
    NSObject* obj1 = [playerForSound objectForKey:identifier];
    // cast the nsobject pointer to an avudioplayer pointer
    AVAudioPlayer* av1= (AVAudioPlayer*)obj1;
     //play
    [av1 play]; 
    
    
}

-(void)audioPlayerDidFinishPlaying:(AVAudioPlayer *)player successfully:(BOOL)flag
{
    return;
}

@end
 

