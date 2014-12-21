({
  //- paths are relative to this app.build.js file
  appDir: "../client-app",
  baseUrl: "js",
  //- this is the directory that the new files will be. it will be created if it doesn't exist
  dir: "../client-app-build",
  paths: {

    debug: 'c:\\Users\\sadams\\node_modules\\debug/debug',
    //events: 'libs/jquery/jquery-min',
    //underscore: 'libs/underscore/underscore-loader',
    //backbone: 'libs/backbone/backbone-loader',
    //text: 'libs/require/text',
    //json: 'libs/json/json2',
    //utils: 'libs/utils',
    //templates: '../templates'
  },
  //optimizeCss: "standard.keepLines",
  modules: [
    {
      name: "client"
    }
  ],
  fileExclusionRegExp: /\.git/
})