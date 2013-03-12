//
//  SSAudioManager.h
//  SpartanMissileStrike
//
//  Created by Shaun Guth on 3/12/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>

@interface SSAudioManager : NSObject
{
    NSDictionary* filenameForSoundId;
    NSMutableDictionary* playerForSoundId;
}

-(void)playSound:(NSString *)soundIdentifier loopCount:(NSInteger)loops;
-(void)stopSound:(NSString *)soundIdentifier;

@end
