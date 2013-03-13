//
//  SSLocationManager.h
//  SpartanMissileStrike
//
//  Created by Shaun Guth on 3/13/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>

typedef void (^SSLocationManagerLocationChangedCallback)(CLLocationCoordinate2D location);

@interface SSLocationManager : NSObject <CLLocationManagerDelegate>
@property (strong, nonatomic) CLLocationManager *locationManager;
@property (strong, nonatomic) SSLocationManagerLocationChangedCallback locationManagerCallback;

-(void)startUpdatingLocationWithCallback:(SSLocationManagerLocationChangedCallback)callback;
-(void)stopUpdatingLocation;
@end