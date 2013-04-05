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
@synthesize azimuth; 

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
 NSNumber* latitude = [NSNumber numberWithDouble:(double) manager.location.coordinate.latitude];
 NSNumber* longitude = [NSNumber numberWithDouble:(double)manager.location.coordinate.longitude];
 NSNumber* altitude = [NSNumber numberWithDouble:(double)manager.location.altitude];
    
    CLLocation *lastLocationUpdate = [locations lastObject];
    CLLocationCoordinate2D lastLocation = [lastLocationUpdate coordinate];
    [self locationManagerCallback](lastLocation);
}

- (void)locationManager:(CLLocationManager *)manager didUpdateHeading:(CLHeading *)newHeading
{
   NSNumber *azimuth  = [NSNumber numberWithDouble:(double)manager.heading.magneticHeading];
 }


 
 



@end