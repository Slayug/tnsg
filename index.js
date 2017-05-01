/*
The MIT License (MIT)

Copyright (c) Alexis Puret <puret.alexis@gmail.com> (slayug.fr)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var writeFile = require('write');
var ArgumentParser = require('argparse').ArgumentParser;
var prompt = require('prompt-sync')();
var read = require('read-file');
var colors = require('colors');
const fileExists = require('file-exists');

const TAG_LOG = "[tnsg] ";
const BREAK_LINE = '\n';
const TAB_CHAR = '    ';
const APP_PATH = './app/'
const DEFAULT_PATH_PAGE = 'pages/';
const DEFAULT_PATH_SERVICE = 'shared/'

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

//COMMAND DESCRIPTION
var parser = new ArgumentParser({
    version: '0.0.1',
    addHelp:true,
    description: 'tnsg'
});
parser.addArgument(
    [ '-page', '-p',  ],
    {
        help: '-p my-new-page b',
        nargs: '*'
    }
);
parser.addArgument(
    [ '-service', '-s' ],
    {
        help: '-s my-new-service',
        nargs: '*'
    }
);
parser.addArgument(
    [ '-class', '-c' ],
    {
        help: '-c my-new-class',
        nargs: '*'
    }
);

var args = parser.parseArgs();

if( args.page != null ){
    for(var p = 0; p < args.page.length; p++){
        log( 'creating page: ' + args.page[ p ] + "..." );
        createPage( args.page[ p ] );
    }
}
if( args.class != null ){
    for(var c = 0; c < args.class.length; c++){
        log( "creating class " + args.class[ c ] + "..." );
        var askCreatePage = prompt( TAG_LOG + "create page with it ? [n|y] (n):", "n");
        var askCreateService = prompt( TAG_LOG + "create service with it ? [n|y] (n):", "n");

        if( askCreatePage == 'y' ){
            createPage( args.class[ c ] );
        }
        if( askCreateService == 'y' ){
            createService( args.class[ c ] );
        }

        createClass( args.class[ c ] );
    }
}
if( args.service != null ){
    for(var p = 0; p < args.service.length; p++){
        log( 'creating service: ' + args.service[ p ] + "..");
        createService( args.service[ p ] );
    }

}

/**
*   Create the page with the name passed
*   Create the following folders: app/pages/pageName
*   Then create the following files:
*       - pageName.android.css
*       - pageName.ios.css
*       - pageName-common.css
*       - pageName.component.ts
*       - pageName.html
*   In last time update the app.module.ts
*   @param {String} 'pageName' page name will be created
**/
function createPage( pageName ){
    //create page with intermediates folders
    writeFileWithCheck( APP_PATH + DEFAULT_PATH_PAGE + pageName + '/' +
    pageName + '.android.css' );

    writeFileWithCheck( APP_PATH + DEFAULT_PATH_PAGE + pageName + '/' +
    pageName + '.ios.css' );

    writeFileWithCheck( APP_PATH + DEFAULT_PATH_PAGE + pageName + '/' +
    pageName + '-common.css' );

    writeFileWithCheck( APP_PATH + DEFAULT_PATH_PAGE + pageName + '/' +
    pageName + '.component.ts', generateContentComponent( pageName ) );

    writeFileWithCheck( APP_PATH + DEFAULT_PATH_PAGE + pageName + '/' +
    pageName + '.html', "<Label text='hello world, i am " + pageName +
    " page.'></Label>");

    insertComponentInModule( pageName );
}

/**
*
*   First check if the file exist, if it is, ask the user if the file should
*   be rewrite, then do it or not.
*   @param {String} 'filePath' path of the file with his name
*   @param {String} 'content' optionnel, content who will write in the file
**/
function writeFileWithCheck( filePath, content ){
    if( fileExists.sync( filePath ) ){
        //prompt if should rewrite the file
        var shouldContinue = prompt( TAG_LOG + "file " + filePath.underline +
        " exists, rewrite ? [n|y] (n):", "n");
        if( shouldContinue === 'n' ){
            //assign if undefined
            return;
        }
    }
    writeFile(filePath, content, function(err) {
        if (err) throw new Error("Cannot writeFile " + filePath +
        BREAK_LINE + err );
    });
    createdX( filePath );
}

/**
*   generate the content of a component
*   i.e with pageName = Login
*   import { Component, OnInit } from "@angular/core";
*   @Component({
*       selector: "my-login",
*       templateUrl: "pages/login/login.html",
*       styleUrls: ["pages/login/login-common.css", "pages/login/login.css"]
*   })
*   export class LoginComponent implements OnInit {
*       constructor() {}
*
*       ngOnInit() {}
**   }
*   @param {String} 'pageName' name of the page, it will be the name of the
*                   component: PageNameComponent
**/
function generateContentComponent( pageName ){
    const DEFAULT_IMPORT = 'import { Component, OnInit } from "@angular/core";';
    const COMPONENT_PART = '@Component({' + BREAK_LINE +
    TAB_CHAR + 'selector: "page-' + pageName + '",' + BREAK_LINE +

    TAB_CHAR + 'templateUrl: "' + DEFAULT_PATH_PAGE + pageName + '/' +
    pageName + '.html",' + BREAK_LINE +

    TAB_CHAR + 'styleUrls: ["' + DEFAULT_PATH_PAGE + pageName + '/' +
    pageName + '-common.css", "' + DEFAULT_PATH_PAGE +
    pageName + '/' + pageName + '.css"]' + BREAK_LINE +
    '})' + BREAK_LINE;

    const EXPORT_CLASS = 'export class ' + pageName.capitalize() + 'Component implements OnInit {' + BREAK_LINE;
    const CONSTRUCTOR = TAB_CHAR + 'constructor(){}' + BREAK_LINE;
    const NG_ON_INIT = TAB_CHAR + 'ngOnInit(){}' + BREAK_LINE;
    const CLOSE_BRACKET = '}';

    return DEFAULT_IMPORT +
    BREAK_LINE + BREAK_LINE +
    COMPONENT_PART + BREAK_LINE +
    EXPORT_CLASS + BREAK_LINE +
    CONSTRUCTOR + BREAK_LINE +
    NG_ON_INIT + BREAK_LINE +
    CLOSE_BRACKET;

}

/**
*   i.e with className = user
*   export class User{
*   }
*   @param {String} 'className' name of the class, it will be the name of the
*                   class: ClassName
**/
function generateContentClass( className ){
    return "export class " + className.capitalize() + "{" + BREAK_LINE + "}";
}

/**
*   Write the file, with the default content of the class
*   @param {String} 'className' name of the class, it will be the name of the
*                   class: ClassName
**/
function createClass( className ){
    writeFileWithCheck( APP_PATH + DEFAULT_PATH_SERVICE + className +
        '/' + className + '.ts', generateContentClass( className )
    );
}

/**
*   Update app.module.ts, insert the import of the component,
*   then insert the name of the component in array declarations.
*   @param {String} 'componentName' name of the component.
*
**/
function insertComponentInModule( componentName ){
    var content = read.sync('./app/app.module.ts', 'utf8');

    //check if Component already inserted in app.module.js
    if( content.indexOf( componentName.capitalize() + "Component" ) !== -1 ){
        return;
    }

    //inserting import
    var headerIndex = content.indexOf( '@NgModule' ) - 1;
    var firstPart = content.substring( 0, headerIndex );
    firstPart += 'import { '+ componentName.capitalize()  +
    'Component } from \'./' + DEFAULT_PATH_PAGE + componentName + '/' + componentName +
    '.component\';' +
    BREAK_LINE + BREAK_LINE;
    content = firstPart + content.substring( headerIndex + 1, content.length );

    //inserting declarations
    var preIndex = content.indexOf( 'declarations: [' );
    var commaIndex = preIndex + content.substring( preIndex ).indexOf( ',' ) + 1;
    firstPart = content.substring( 0, commaIndex );
    firstPart += BREAK_LINE + TAB_CHAR + TAB_CHAR+ componentName.capitalize() + "Component,";
    var secondPart = content.substring( commaIndex, content.length );

    content = firstPart + secondPart;
    //update app.module
    writeFile('./app/app.module.ts', content, function(err) {
        if (err) log(err);
    });
    updatedX( APP_PATH + 'app.module.ts' );
}

/**
*   i.e with serviceName = user
*   import { Injectable } from '@angular/core';
*
*   @Injectable()
*   export class UserService {
*       constructor() { }
*   }
*
*   @param {String} 'serviceName' name of the service, it will be the name of the
*                   service: ServiceNameService
**/
function generateContentService( serviceName ){
    return "import { Injectable } from '@angular/core';" + BREAK_LINE +
    BREAK_LINE +
    "@Injectable()" + BREAK_LINE +
    "export class " + serviceName.capitalize() + "Service {"+ BREAK_LINE +
    TAB_CHAR + "constructor() { }" + BREAK_LINE + "}";
}

/**
*   Write the file, with the default content of service
*   @param {String} 'className' name of the service, it will be the name of the
*                   service: ServiceNameService
**/
function createService( serviceName ){
    writeFileWithCheck( APP_PATH + DEFAULT_PATH_SERVICE + serviceName +
        '/' + serviceName + '.service.ts',
        generateContentService( serviceName )
    );

    warning( 'Service is generated but not provided, it must be provided to be used.' );
}

function log( msg ){
    console.log( TAG_LOG + msg );
}

function createdX( x ){
    log( "created: ".green + x );
}
function updatedX( x ){
    log( "updated: ".yellow + x );
}

function logSuccess( msg ){
    log( msg.green );
}
function logError( msg ){
    log( msg.red );
}

function warning( warning ){
    log( 'WARNING'.yellow + ' ' + warning );
}
