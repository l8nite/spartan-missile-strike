//
//  SSLocationManager.m
//  Spartan Missile Strike
//
//  Created by Sherif on 12/22/12.
//  Copyright (c) 2012 Jomana Sherif. All rights reserved.
//

#import "SSLocationManager.h"

@implementation SSLocationManager
@synthesize longitude, latitude, horizontalAccuracy, verticalAccuracy,altitude,distance;
@synthesize locationManager, startLocation;




- (void)viewDidLoad {
    self.locationManager = [[CLLocationManager alloc] init];
    locationManager.desiredAccuracy = kCLLocationAccuracyBest;
    locationManager.delegate = self;
    [locationManager startUpdatingLocation];
    startLocation = nil;
    [super viewDidLoad];
}


-(void)resetDistance
{
    startLocation = nil;
}

-(void)locationManager:(CLLocationManager *)manager
   didUpdateToLocation:(CLLocation *)newLocation
          fromLocation:(CLLocation *)oldLocation
{
    NSString *currentLatitude = [[NSString alloc]
                                 initWithFormat:@"%g",
                                 newLocation.coordinate.latitude];
    latitude.text = currentLatitude;
    
    NSString *currentLongitude = [[NSString alloc]
                                  initWithFormat:@"%g",
                                  newLocation.coordinate.longitude];
    longitude.text = currentLongitude;
    
    NSString *currentHorizontalAccuracy =
    [[NSString alloc]
     initWithFormat:@"%g",
     newLocation.horizontalAccuracy];
    horizontalAccuracy.text = currentHorizontalAccuracy;
    
     NSString *currentAltitude = [[NSString alloc]
                                 initWithFormat:@"%g",
                                 newLocation.altitude];
    altitude.text = currentAltitude;

    
    NSString *currentVerticalAccuracy =
    [[NSString alloc]
     initWithFormat:@"%g",
     newLocation.verticalAccuracy];
    verticalAccuracy.text = currentVerticalAccuracy;
    
    if (startLocation == nil)
        self.startLocation = newLocation;
    
    CLLocationDistance distanceBetween = [newLocation
                                          distanceFromLocation:startLocation];
    
    NSString *tripString = [[NSString alloc]
                            initWithFormat:@"%f",
                            distanceBetween];
    distance.text = tripString;
    
    
}


-(void)locationManager:(CLLocationManager *)manager
      didFailWithError:(NSError *)error
{
}


- (void)viewDidUnload {
    // Release any retained subviews of the main view.
    // e.g. self.myOutlet = nil;
    self.latitude = nil;
    self.longitude = nil;
    self.horizontalAccuracy = nil;
    self.verticalAccuracy = nil;
    self.altitude = nil;
    self.startLocation = nil;
    self.distance = nil;
    self.locationManager = nil;
} 

@end