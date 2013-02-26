//
//  SSNewGameViewController.m
//  SpartanMissileStrike
//
//  Created by Sherif on 2/25/13.
//  Copyright (c) 2013 Group 2. All rights reserved.
//

#import "SSNewGameViewController.h"
#import <MapKit/MapKit.h>

@interface SSNewGameViewController () <UIPickerViewDelegate,UIPickerViewDataSource>{
    
    __strong UIPickerView *friendsPicker;
    NSArray *fakeFriends;
    
    
    
}
@property(nonatomic,strong) UIPickerView *friendsPicker;
@property(nonatomic,strong) NSArray *fakeFriends;

@end

@implementation SSNewGameViewController
@synthesize friendsPicker,fakeFriends;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    
    fakeFriends = [[NSArray alloc] initWithObjects:@"Jomana",@"Shaun",@"JoJo",@"Chris", @"Perry", @"Sai", nil];
    NSLog(@"ff : %i",fakeFriends.count);
    self.title = @"New Game";
    
    UIBarButtonItem *cancelButtonItem = [[UIBarButtonItem alloc] initWithTitle:@"Cancel" style:UIBarButtonItemStyleBordered target:self action:@selector(cancel:)];
    self.navigationItem.leftBarButtonItem = cancelButtonItem;
    
    friendsPicker = [[UIPickerView alloc] init];
    friendsPicker.frame = CGRectMake(0, 40, 320, 180);
    friendsPicker.delegate = self;
    friendsPicker.dataSource = self;
    [friendsPicker setShowsSelectionIndicator:YES];
    //[self.friendsPicker selectRow:1 inComponent:0 animated:NO];
    [self.view addSubview:friendsPicker];
    
    
    
    
}



#pragma mark UIPickerViewDataSource

- (NSInteger)numberOfComponentsInPickerView:(UIPickerView *)pickerView
{
    return 1;
}

- (NSInteger)pickerView:(UIPickerView *)pickerView
numberOfRowsInComponent:(NSInteger)component
{
    if(component == 0){
        return [fakeFriends count];
    }else
        return 5;
    
}

- (CGFloat)pickerView:(UIPickerView *)pickerView
    widthForComponent:(NSInteger)component{
    
    return 180;
    
}

- (NSString *)pickerView:(UIPickerView *)pickerView
             titleForRow:(NSInteger)row
            forComponent:(NSInteger)component
{
    
    
    if(component == 0){
        return [fakeFriends objectAtIndex:row];
    }
    return nil;
    
}
- (void) pickerView:(UIPickerView *)pickerView didSelectRow:(NSInteger)row inComponent:(NSInteger)component
{
    
}




#pragma mark MKMapViewDelegate

- (void)mapView:(MKMapView *)mapView didChangeUserTrackingMode:(MKUserTrackingMode)mode animated:(BOOL)animated {
    NSLog(@"didChangeUserTrackingMode");
}

- (MKAnnotationView *)mapView:(MKMapView *)mapView viewForAnnotation:(id < MKAnnotation >)annotation {
    // Return nil for the MKUserLocation object
    //creating the checking 
    if ([annotation isKindOfClass:[MKUserLocation class]]) {
        //   self.lastUserAnnotation = annotation;
        NSLog(@"Returning nil for MKUserLocation Lat:%f Long:%f", annotation.coordinate.latitude, annotation.coordinate.longitude);
        return nil;
    }
    NSLog(@"Creating view for annotation %@", annotation);
    
    if (!annotation) {
        NSLog(@"ANNOTATION IS EMPTY!!!!");
    }
    MKPinAnnotationView *pinView = [[MKPinAnnotationView alloc] initWithAnnotation:annotation reuseIdentifier:nil];
    pinView.pinColor = MKPinAnnotationColorPurple;
    pinView.animatesDrop = YES;
    
}

- (void)mapView:(MKMapView *)mapView didAddAnnotationViews:(NSArray *)views {
    NSLog(@"Annotations added to map %@", views);
    if ([views count] > 0) {
        MKAnnotationView *view = [views objectAtIndex:0];
        CLLocationCoordinate2D coord = view.annotation.coordinate;
     }
}




- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

-(void)cancel:(id)sender{
    [self dismissViewControllerAnimated:YES completion: nil];
}

@end
