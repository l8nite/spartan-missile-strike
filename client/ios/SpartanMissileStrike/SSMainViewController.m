//
//  SSMainViewController.m
//  SpartanMissileStrike
//
//  Created by Sherif on 1/9/13.
//  Copyright (c) 2013 Group 2. All rights reserved.
//

#import "SSMainViewController.h"
#import "SSAudioManager.h"

@interface SSMainViewController ()

@end

@implementation SSMainViewController

//-(IBAction)boom;
//{
//    CFBundleRef mainBundle = CFBundleGetMainBundle();
//    CFURLRef soundFileURLRef;
//    soundFileURLRef = CFBundleCopyResourceURL(mainBundle, (CFStringRef) @"helicopter", CFSTR ("m4a"), NULL);
//    
//    //telling it to play over the system sound 
//    UInt32 soundID;
//    AudioServicesCreateSystemSoundID(soundFileURLRef, &soundID);
//    AudioServicesPlaySystemSound(soundID);
//}

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)ButtonPressed:(id)sender {
    SSAudioManager* sa1 = [[SSAudioManager alloc]init];
    [sa1 playSound:@"HELICOPTER"];
      
    
}
@end
