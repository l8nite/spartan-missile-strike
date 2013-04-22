//
//  SSOrientationManager.m
//  SpartanMissileStrike
//
//  Created on 3/13/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import "SSOrientationManager.h"

@implementation SSOrientationManager

@synthesize motionManager;

-(id)init
{
    if (self = [super init]) {
        motionManager = [[CMMotionManager alloc] init];
        [motionManager setGyroUpdateInterval:1.0/120.0];
    }

    return self;
}

-(void)startUpdatingOrientationWithCallback:(SSOrientationManagerOrientationChangedCallback)callback
{
    NSOperationQueue *orientationUpdatesQueue = [[NSOperationQueue alloc] init];
    
    [motionManager startDeviceMotionUpdatesUsingReferenceFrame:CMAttitudeReferenceFrameXTrueNorthZVertical toQueue:orientationUpdatesQueue withHandler:^(CMDeviceMotion *motion, NSError *error) {
        if (motion != nil) {
            callback(motion.attitude);
        }
    }];
}

-(void)stopUpdatingOrientation
{
    [motionManager stopDeviceMotionUpdates];
}

@end
