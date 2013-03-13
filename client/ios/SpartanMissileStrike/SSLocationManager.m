//
//  SSLocationManager.m
//  SpartanMissileStrike
//
//  Created by Shaun Guth on 3/13/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import "SSLocationManager.h"

typedef void (^SSLocationManagerLocationChangedCallback)(void);

@implementation SSLocationManager
@synthesize locationManager;
-(id)init
{
    if (self = [super init]) {
        locationManager = [[CLLocationManager alloc] init];
        [locationManager setDelegate:self];
        // (iOS 6 only, but allows location updates to stop if user has stopped moving)
        // [locationManager setActivityType:CLActivityTypeFitness];
    }
    return self;
}

-(void)startUpdatingLocationWithCallback:(SSLocationManagerLocationChangedCallback)callback
{
    // push callback on queue? assume only one ever?
}

-(void)stopUpdatingLocation
{
    [locationManager stopUpdatingLocation];
}

@end
