//
//  SSNativeBridge.m
//  SpartanMissileStrike
//
//  Created by Sherif on 1/6/13.
//  Copyright (c) 2013 Group 2. All rights reserved.
//

#import "SSNativeBridge.h"
#import "JSON.h"

@implementation SSNativeBridge

// pass a string that a UIwebview would give me
// parsing the string and calling the appropriate methods
-(void)parseFakeInput: (NSString*)input
{
    NSString* fakeInput= @"";
    NSArray* contents = [fakeInput componentsSeparatedByString:@"("];
    NSString* afterwards = [contents objectAtIndex:1];
    contents = [afterwards componentsSeparatedByString:@")"];
    NSString* myString = [contents objectAtIndex:0];
    
    
    NSLog(@"%@", input);
}

/**
 brackets are used for arrays in JSON that contain data
 braces are dictionaries for the data
 */
-(void)secondParseFakeInput
{
    NSDictionary* reference = [NSDictionary dictionaryWithObjectsAndKeys:_name, @"name",
                           _friends,@"friends"];
    // Adding the data to the class
    NSDictionary *finalData = [NSDictionary dictionaryWithObject:reference forKey:@"ref"];
    // generating the json representation of our class dictionary
    NSString* newjson = [finalData JSONRepresentation];
    /**
     loading the JSON message into an NSString
     */
    NSString* jsonString = [[NSString alloc] initWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"data" ofType:@"json"] encoding:NSUTF8StringEncoding error:&error];
    
    /**
     parsing an array
     */
    NSArray* result = [jsonString JSONValue];
}
/**
 this will notify us when the data is being sent to us
 when the request is complete
 when there is no more data to recieve
 */
- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response {
    [responseData setLength:0];
}
- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data {
    [responseData appendData:data];
}
- (void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error {
    label.text = [NSString stringWithFormat:@"Connection failed: %@", [error description]];
}
/**
 parsing the json file
 creating array
 reciveing the array
 */
- (void)connectionDidFinishLoading:(NSURLConnection *)connection {
    [connection release];
    NSString *responseString = [[NSString alloc] initWithData:responseData encoding:NSUTF8StringEncoding];
    [responseData nil];
    NSDictionary *results = [responseString JSONValue];
    NSArray *allTweets = [results objectForKey:@"results"];
}

@end
