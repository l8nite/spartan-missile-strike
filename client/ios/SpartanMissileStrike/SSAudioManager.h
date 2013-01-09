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

@interface SSAudioManager : NSObject  
{
    
}

-(NSString*)pathForSoundIdentifier:(NSString*)identifier;
-(void)playSound:(NSString*)identifier;


@end
