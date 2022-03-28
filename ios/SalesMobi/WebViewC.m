//
//  WebViewC.m
//  BajajCapital
//
//  Created by SimpleCRM on 24/08/21.
//  Copyright © 2021 Facebook. All rights reserved.
//


#import "WebViewC.h"
#import <React/RCTLog.h>

//- (void)viewDidLoad {
//    [super viewDidLoad];
//
//}
//
//- (void)didReceiveMemoryWarning {
//    [super didReceiveMemoryWarning];
//    // Dispose of any resources that can be recreated.
//}


//@interface WebViewC() UIViewController
//@end

@implementation WebViewC

RCT_EXPORT_MODULE();

//RCT_EXPORT_METHOD(addEvent:(NSString *)name location:(NSString *)location)
//{
//  RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
//}


//
RCT_EXPORT_METHOD(loadUIWebView:(NSString *) productURL)
{
//  self.productURL = @"http://www.URL YOU WANT TO VIEW GOES HERE";
    RCTLogInfo(@"Pretending test: productURL = %@",productURL);

  
//  NSURL *url = [NSURL URLWithString: productURL];
//  NSURLRequest *request = [NSURLRequest requestWithURL:url];
//  _view = [UIViewController alloc];
//
//  _webView = [[WKWebView alloc] initWithFrame:self.view.frame];
//  [_webView loadRequest:request];
//  _webView.frame = CGRectMake(self.view.frame.origin.x,self.view.frame.origin.y, self.view.frame.size.width, self.view.frame.size.height);
//  [self.view addSubview:_webView];
  
//
  
//    dispatch_async(dispatch_get_main_queue(), ^{
//        // Your code to run on the main queue/thread
//
//  UIWebView *webView = [[UIWebView alloc] initWithFrame:CGRectMake(0, 0, 320, 480)];
//  [webView setDelegate:self];
//
//  NSString *urlAddress = @"http://www.google.com/";
//  NSURL *url = [NSURL URLWithString:urlAddress];
//  NSURLRequest *requestObj = [NSURLRequest requestWithURL:url];
//  [webView loadRequest:requestObj];
////  _view = [UIViewController alloc];
//
//  [self.view addSubview:webView];
//
//    });
  RCTLogInfo(@"Pretending test: end");
}

//This method should get called when you want to add and load the web view

@end

//#import <Foundation/Foundation.h>
//#import "WebViewC.h"
//#import <React/RCTLog.h>
//
//#import "FilteredURLProtocol.h"
// @implementation WebViewC
//
//// To export a module named CalendarManager
//void RCT_EXPORT_MODULE();
//
////React Native will not expose any methods of CalendarManager to JavaScript unless explicitly told to
//RCT_EXPORT_METHOD(addEvent:(NSString) name)
//{
//  RCTLogInfo(@"Pretending to create an event %@", name);
//}
//
//- (float) divNum1: (int) a : (int) b {
//    return (float)a /(float)b;
//}
//
////RCT_EXPORT_METHOD(showWebView:(RCTResponseSenderBlock)callback)
//// {
////  [NSURLProtocol registerClass:FilteredURLProtocol.class];
////  NSString* result = @"showWebView";
////  callback(@[result]);
////}
////
////+ (NSString *) webScriptNameForSelector:(SEL)sel
////{
////    if (sel == @selector(nameAtIndex:))
////            name = @"nameAtIndex";
////
////    return name;
////}
////
////+ (BOOL)isSelectorExcludedFromWebScript:(SEL)aSelector
////{
////    if (sel == @selector(nameAtIndex:)) return NO;
////    return YES;
////}
//
//@end
