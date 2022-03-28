//
//  MyViewController.swift
//  SalesMobi
//
//  Created by SimpleCRM on 09/09/21.
//  Copyright © 2021 Facebook. All rights reserved.
//

import Foundation

import UIKit
import React

class MyViewController: UIViewController {
    override func viewDidLoad() {
        setupReactNative()
        registerToReactNativeEvents()
    }
    
    private func setupReactNative() {
        let rootView = RCTRootView(
            bundleURL: URL(string: "http://localhost:8081/index.bundle?platform=ios"),
            moduleName: "ReactNativeModal",
            initialProperties: nil,
            launchOptions: nil
        )
        self.view = rootView
    }
    
    private func registerToReactNativeEvents() {
        NotificationCenter.default.addObserver(self,
                                               selector: #selector(closeModal),
                                               name: NSNotification.Name(rawValue: ReactEventCloseModal),
                                               object: nil)
    }
    
    @objc private func closeModal() {
        DispatchQueue.main.async { [unowned self] in
            self.dismiss(animated: true, completion: nil)
          //here write the code to show webview
          
        }
    }
}
