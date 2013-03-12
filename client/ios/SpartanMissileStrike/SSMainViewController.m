//
//  SSViewController.m
//  SpartanMissileStrike
//
//  Created by Shaun Guth on 3/11/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import "SSMainViewController.h"

@implementation SSMainViewController

@synthesize webView;

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.
    [self initializeHtmlContent];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)viewDidUnload
{
    [self setWebView:nil];
    [super viewDidUnload];
}

- (void)initializeHtmlContent
{
    NSURL *indexURL = [NSURL fileURLWithPath:[[NSBundle mainBundle] pathForResource:@"html/View/ViewFramework-test" ofType:@"html"] isDirectory:NO];
    NSURLRequest *initialLoadRequest = [NSURLRequest requestWithURL:indexURL];
    [webView loadRequest:initialLoadRequest];
}

@end
