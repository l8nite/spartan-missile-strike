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
      didFailWithError:(NSError *)error
{
}

@end