npm install -g gulp-cli
npm install


Issue:
ReferenceError: primordials is not defined
https://stackoverflow.com/questions/55921442/how-to-fix-referenceerror-primordials-is-not-defined-in-node-js
"gulp": "^3.9.1" requires this if using node version >16 :
If your version is v16.14.0 or above, then you can override the version of graceful-fs by adding an overrides section in your package.json file:
```
  "overrides": {
    "graceful-fs": "^4.2.11"
  },
```



gulp clean
gulp taskHBS
gulp taskCSS
gulp taskJS