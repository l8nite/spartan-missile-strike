//
//  SSLocationManager.h
//  Spartan Missile Strike
//
//  Created by Sherif on 12/22/12.
//  Copyright (c) 2012 Jomana Sherif. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <CoreLocation/CoreLocation.h>


@interface SSLocationManager :UIViewController
<CLLocationManagerDelegate>
{
    CLLocationManager *locationManager;
    UILabel *latitude;
    UILabel *longitude;
    UILabel *horizontalAccuracy;
    UILabel *altitude;
    UILabel *verticalAccuracy;
    UILabel *distance;
    UIButton *resetButton;
    CLLocation *startLocation;
}
@property (nonatomic, retain) CLLocationManager *locationManager;
@property (nonatomic, retain) IBOutlet UILabel *latitude;
@property (nonatomic, retain) IBOutlet UILabel *longitude;
@property (nonatomic, retain) IBOutlet UILabel *horizontalAccuracy;
@property (nonatomic, retain) IBOutlet UILabel *verticalAccuracy;
@property (nonatomic, retain) IBOutlet UILabel *altitude;
@property (nonatomic, retain) IBOutlet UILabel *distance;
@property (nonatomic, retain) CLLocation *startLocation;
- (IBAction)resetDistance;
@end


