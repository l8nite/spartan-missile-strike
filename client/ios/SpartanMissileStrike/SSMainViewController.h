//
//  SSMainViewController.h
//  SpartanMissileStrike
//
//  Created by Sherif on 1/9/13.
//  Copyright (c) 2013 Group 2. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "SSAudioManager.h"
#import "SSNativeBridge.h"
@interface SSMainViewController : UIViewController
{
    SSAudioManager* sa1;
 }
@property (nonatomic,retain)IBOutlet UIWebView* myHTML;

@end
