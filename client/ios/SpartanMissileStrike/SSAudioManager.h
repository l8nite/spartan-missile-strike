//
//  SSAudioManager.h
//  SpartanMissileStrike
//
//  Created by Sherif on 1/3/13.
//  Copyright (c) 2013 Group 2. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>
#import <AudioToolbox/AudioToolbox.h>

@interface SSAudioManager : NSObject
{
    NSMutableDictionary* playerForSound;
    NSDictionary* filenameForSound;
    
    __strong AVAudioPlayer *player;
    
}
@property (nonatomic,strong) AVAudioPlayer *player;
-(void)playSound:(NSString*)identifier;
-(AVAudioPlayer*)createAVAudioPlayer;


@end

