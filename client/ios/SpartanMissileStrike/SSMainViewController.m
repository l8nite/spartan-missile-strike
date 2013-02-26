//
//  SSMainViewController.m
//  SpartanMissileStrike
//
//  Created by Sherif on 1/9/13.
//  Copyright (c) 2013 Group 2. All rights reserved.
//

#import "SSMainViewController.h"
#import "SSAudioManager.h"
#import "SSNewGameViewController.h"


@interface SSMainViewController()
@end

@implementation SSMainViewController
@synthesize myHTML;

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    NSString* pathforAddress = [[NSBundle mainBundle] pathForResource:@"ViewFramework-test" ofType:@"html"];
    NSURL* url = [NSURL fileURLWithPath:pathforAddress];
    NSURLRequest* requestobj = [NSURLRequest requestWithURL:url];
    
    
    //Going to UIView
    [self.view setBackgroundColor:[UIColor colorWithRed:108.0/255.0 green:98.0/255.0 blue:239.0/255.0 alpha:1]];
    
    UIButton *mainViewButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
    mainViewButton.frame = CGRectMake(80, 50, 160, 30);
    [mainViewButton setTitle:@"Resume Game" forState:UIControlStateNormal];
    [mainViewButton addTarget:self action:@selector(resumeGame:) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:mainViewButton];
    
    UIButton *newGameButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
    newGameButton.frame = CGRectMake(80, 100, 160, 30);
    [newGameButton setTitle:@"New Game" forState:UIControlStateNormal];
    [newGameButton addTarget:self action:@selector(newGame:) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:newGameButton];
    
    UIButton *acceptInviteButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
    acceptInviteButton.frame = CGRectMake(80, 150, 160, 30);
    [acceptInviteButton setTitle:@"Accept Invitation" forState:UIControlStateNormal];
    [acceptInviteButton addTarget:self action:@selector(acceptInvite:) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:acceptInviteButton];
    
    UIButton *optionsButton = [UIButton buttonWithType:UIButtonTypeInfoLight];
    optionsButton.frame = CGRectMake(280, 10, 30, 30);
    [optionsButton addTarget:self action:@selector(myOptions:) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:optionsButton]; 
}

/**
 1. Set up these methods for each button action
 2. Create new View controller for each method
 3. Include each class at the top of this class
 4. Init each instance of the class
*/

/*
-(void)resumeGame:(id)sender{
    SSMainViewController* ng = [[SSMainViewController alloc] initWithNibName:@"SSNewGameViewController" bundle:nil];
    UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:ng];
    [self presentViewController:navigationController animated:YES completion:nil];
}
*/

-(void)newGame:(id)sender{
    
    SSNewGameViewController* ng = [[SSNewGameViewController alloc] initWithNibName:@"SSNewGameViewController" bundle:nil];
    UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:ng];
    [self presentViewController:navigationController animated:YES completion:nil];
    
    
}

-(void) acceptInvitation:(id)sender{
    
    
}


-(void)optionsButton:(id)sender{
    
    
}



- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}
-(void)viewDidAppear:(BOOL)animated
{
    
    
    
    sa1 = [[SSAudioManager alloc]init];
    [sa1 playSound:@"MODERATO"];
}

@end