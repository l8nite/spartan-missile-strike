//
//  SSLocationManager.h
//  SpartanMissileStrike
//
//  Created on 3/13/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>

typedef void (^SSLocationManagerLocationChangedCallback)(CLLocationCoordinate2D location);

@interface SSLocationManager : NSObject <CLLocationManagerDelegate>
@property (strong, nonatomic) CLLocationManager *locationManager ;
@property (nonatomic, retain) CLLocationManager *azimuth;
@property (strong, nonatomic) SSLocationManagerLocationChangedCallback locationManagerCallback;

-(void)startUpdatingLocationWithCallback:(SSLocationManagerLocationChangedCallback)callback;
-(void)stopUpdatingLocation;
- (void)locationManager:(CLLocationManager *)manager didUpdateHeading:(CLHeading *)newHeading; 
@end