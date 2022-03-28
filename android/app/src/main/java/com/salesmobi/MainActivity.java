package com.salesmobi;

import com.facebook.react.ReactActivity;
import com.reactnativenavigation.bridge.NavigationReactModule;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        //!Check how to get version code/name here and pass it to React-Native .js file
        // final Map<String, Object> constants = new HashMap<>();
        // final PackageManager packageManager = getPackageManager();
        // final String packageName = this.reactContext.getPackageName();
        // try {
        //   constants.put(APP_VERSION, packageManager.getPackageInfo(packageName, 0).versionName);
        //   constants.put(APP_BUILD, packageManager.getPackageInfo(packageName, 0).versionCode);
        //   constants.put(APP_ID, packageName);
        // } catch (NameNotFoundException e) {
        //   e.printStackTrace();
        // }    
        
        NavigationReactModule.setInitialProps(props);
        return "SalesMobi";
    }
}
