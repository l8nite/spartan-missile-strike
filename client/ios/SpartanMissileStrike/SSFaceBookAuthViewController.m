//
//  SSFaceBookAuthViewController.m
//  SpartanMissileStrike
//
//  Created by Sherif on 2/26/13.
//  Copyright (c) 2013 Group 2. All rights reserved.
//

#import "SSFaceBookAuthViewController.h"
#import "SSAppDelegate.h"

@interface SSFaceBookAuthViewController ()

@end

@implementation SSFaceBookAuthViewController
@synthesize session = _session;
@synthesize facebookName = _facebookName;
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}


- (void)loadView
{
    
    UIView *view = [[UIView alloc] initWithFrame:[UIScreen
                                                  mainScreen].applicationFrame];
    UIImageView *posterView = [[UIImageView alloc] initWithFrame:[UIScreen
                                                                  mainScreen].applicationFrame];
    posterView.image = [UIImage imageNamed:@"launch320x4802"];
    
    [view addSubview:posterView];
    
    UIButton *fbLoginButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
    fbLoginButton.frame = CGRectMake(60, 240, 200, 43);
    [fbLoginButton setTitle:@"Connect with Facebook" forState:UIControlStateNormal];
    [fbLoginButton addTarget:self action:@selector(loginFB:) forControlEvents:UIControlEventTouchUpInside];
    [view addSubview:fbLoginButton];
    
    
    
    self.view = view;
    
    
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    
}

- (void)loginFailed {
    // FBSample logic
    // Our UI is quite simple, so all we need to do in the case of the user getting
    // back to this screen without having been successfully authorized is to
    // stop showing our activity indicator. The user can initiate another login
    // attempt by clicking the Login button again.
}



-(void)loginFB:(id)sender{
    
    
    // FBSample logic
    // The user has initiated a login, so call the openSession method.
    SSAppDelegate *appDelegate = (SSAppDelegate*)[UIApplication sharedApplication].delegate;
    [appDelegate openSessionWithAllowLoginUI:YES];
}






- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
