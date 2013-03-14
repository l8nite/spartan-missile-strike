//
//  SSOrientationManager.h
//  SpartanMissileStrike
//
//  Created by Shaun Guth on 3/13/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreMotion/CoreMotion.h>

typedef void (^SSOrientationManagerOrientationChangedCallback)(CMAttitude *attitude);

@interface SSOrientationManager : NSObject
@property (strong, nonatomic) CMMotionManager *motionManager;

-(void)startUpdatingOrientationWithCallback:(SSOrientationManagerOrientationChangedCallback)callback;
-(void)stopUpdatingOrientation;

@end
