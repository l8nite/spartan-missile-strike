//
//  SSAudioManager.m
//  SpartanMissileStrike
//
//  Created by Sherif on 1/3/13.
//  Copyright (c) 2013 Group 2. All rights reserved.
//

#import "SSAudioManager.h"

@implementation SSAudioManager
@synthesize     player;

// mulitple sounds, muting , volume
// methods: play sound, mute sound effect, mute backgorund music, play background music
-(id)init{
    self = [super init];
    
    filenameForSound = [NSDictionary dictionaryWithContentsOfFile:[[NSBundle mainBundle] pathForResource: @"sounds" ofType: @"plist"] ];
    
    playerForSound = [[NSMutableDictionary alloc] init];
    
    for (NSString* key in filenameForSound)
    {
        
        NSLog(@"key in Filenameforsound: %@",key);
        NSURL* url = [[NSBundle mainBundle] URLForResource: [filenameForSound objectForKey:key]  withExtension:@"mp3"];
        NSLog(@"ENTERED url dscrip %@", url.description);
        
        
        AVAsset *asset = [AVURLAsset URLAssetWithURL:url options:nil];
        AVPlayerItem *playerItem = [AVPlayerItem playerItemWithAsset:asset];

        player = [self createAVAudioPlayer];
      // NSError *theerr;
        
       [player initWithContentsOfURL:url error:nil];
       // player = [AVPlayer playerWithPlayerItem:playerItem];
        
        [playerForSound setObject:player forKey:key];
        
       ///ARC requirement need proper mem binding
   // NSLog(@"Player URL %@",player.url);
        
        /*
         Background Music
         */
        // get the nsobject pointer from plist dictionary
//        
//        NSDictionary *bckDict = [NSDictionary dictionaryWithContentsOfFile:[[NSBundle mainBundle] pathForResource: @"sounds" ofType: @"plist"] ];
//        NSLog(@"dct; %@",bckDict);
//        
//        NSURL* url = [[NSBundle mainBundle] URLForResource: [bckDict objectForKey:@"MODERATO"]  withExtension:@"mp3"];
//        AVPlayerItem *playerItem = [AVPlayerItem playerItemWithURL:url];
//        NSLog(@"playeritem: %@",playerItem.description);
//        AVPlayer* av1 = [AVPlayer playerWithPlayerItem:playerItem];
//        [av1 play];
//        NSLog(@"av1 :%lld",av1.currentItem.duration.value);
//
//        
    }
    
    return self;
}

-(void)playSound:(NSString*)identifier
{
    NSLog(@"identifier %@", identifier.description);

    
    // get the nsobject pointer from playerforsound dictionary
    NSObject* obj1 = [playerForSound objectForKey:identifier];
    // cast the nsobject pointer to an avudioplayer pointer
    AVAudioPlayer* av1= (AVAudioPlayer*)obj1;
   
    [av1 play];
    
}
/**
    Factory Method
 */

-(AVAudioPlayer*)createAVAudioPlayer
{
    return [AVAudioPlayer alloc];
}

@end
 

