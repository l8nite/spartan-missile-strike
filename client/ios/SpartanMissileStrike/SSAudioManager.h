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

-(void)playSound:(NSString *)soundIdentifier;
-(void)stopSound:(NSString *)soundIdentifier;

@end
