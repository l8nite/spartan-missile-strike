//
//  SSLocationManager.m
//  SpartanMissileStrike
//
//  Created  on 3/13/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import "SSLocationManager.h"

@implementation SSLocationManager

@synthesize locationManager;
@synthesize locationManagerCallback;
 
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
    locationManagerCallback = callback;

    [locationManager startUpdatingLocation];
    // push callback on queue? assume only one ever?
}

-(void)stopUpdatingLocation
{
    [locationManager stopUpdatingLocation];
}

-(void)locationManager:(CLLocationManager*)manager didUpdateLocations:(NSArray *)locations
{    
    CLLocation *lastLocationUpdate = [locations lastObject];
    CLLocationCoordinate2D lastLocation = [lastLocationUpdate coordinate];
    [self locationManagerCallback](lastLocation);
}

 

 
 



@end