//
//  SSAudioManager.h
//  Spartan Missile Strike
//
//  Created by Sherif on 12/22/12.
//  Copyright (c) 2012 Jomana Sherif. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <AVFoundation/AVFoundation.h>
// singletin 
@interface SSAudioManager : UIViewController
<AVAudioPlayerDelegate>
{
    AVAudioPlayer *audioPlayer;
    UISlider *volumeControl;
}

@property (nonatomic, retain) IBOutlet UISlider *volumeControl;
-(IBAction)playAudio;
-(IBAction) stopAudio;
-(IBAction) adjustVolume;
@end
