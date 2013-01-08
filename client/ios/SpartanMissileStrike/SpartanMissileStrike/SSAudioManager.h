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
  
    AVAudioPlayer* theAudio;
}

@property (nonatomic, retain) IBOutlet UIWindow* window;

//-(IBAction)playSoundLaunch;
//-(IBAction)stopSoundLaunch;
//-(IBAction)muteSoundEffect;
//-(IBAction)muteBackgroundMusic;
//-(IBAction)playBackgroundMusic;

-(IBAction)play;
-(IBAction)stop;
-(IBAction)pause;

@end
