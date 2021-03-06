'use strict';
let mix = require('laravel-mix');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');
const imageminMozjpeg = require('imagemin-mozjpeg');

mix.disableNotifications();

function IntranetOne2(params={}){
  
  let $ = this;
  this.mix = mix;
  let src = {
    root:'node_modules/intranetone/src/base/',
    js:'node_modules/intranetone/src/base/js/',
    css:'node_modules/intranetone/src/base/css/',
    vendors:'node_modules/intranetone/src/base/vendors/',
    io:{
      root:'node_modules/intranetone/src/io/',
      js:'node_modules/intranetone/src/io/js/',
      css:'node_modules/intranetone/src/io/css/',
      vendors:'node_modules/intranetone/src/io/vendors/',
    },
    fe:{
      root:'resources/assets/dataview/fe/',
      js:'resources/assets/dataview/fe/js/',
      css:'resources/assets/dataview/fe/css/',
      vendors:'resources/assets/dataview/fe/vendors/',
    },
  }
  this.src = src;
  
  let dest = {
    root:'public/',
    js:'public/js/',
    css:'public/css/',
    vendors:'public/vendors/',
    io:{
      root:'public/io/',
      js:'public/io/js/',
      css:'public/io/css/',
      vendors:'public/io/vendors/',
    },
    fe:{
      root:'public/fe/',
      js:'public/fe/js/',
      css:'public/fe/css/',
      vendors:'public/fe/vendors/',
    }
  }
  this.dest = dest;
  
  let dep = {
    jquery:'node_modules/jquery/dist/',
    popperjs:'node_modules/popper.js/dist/',
    pickadate: 'node_modules/pickadate/lib/',
    photoswipe: 'node_modules/photoswipe/dist/',
    dv_formvalidation:'node_modules/dv-formvalidation/dist/',
    dv_holdonjs:'node_modules/dv-holdOn/src/',
    animate:'node_modules/animate.css/',
    sweetalert2:'node_modules/sweetalert2/dist/',
    jquery_mask: 'node_modules/jquery-mask-plugin/dist/',
    es6_shim: 'node_modules/es6-shim/',
    bs:'node_modules/bootstrap/dist/',
    io:{
      fuelux: 'node_modules/fuelux/',
      toastr:'node_modules/toastr/build/',
      datatables:{
        css:'node_modules/datatables.net-dt/css/',
        js:'node_modules/datatables.net/js/',
        bs4:'node_modules/datatables.net-bs4/'
      },
      elektron: 'node_modules/elektron/',
      onoffcanvas: 'node_modules/onoffcanvas/dist/',
    }
  }
  this.dep = dep;

  let config = params.config || {
    optimize:false,
    sass:false,
    io:{
      optimize:false,
      sass:true,
      fe:false,
    },
    fe:{
      optimize:false,
      sass:true,
      fe:false,
    },
  }
  this.setConfig = (module,param,value)=>{
    if(module == 'base'){
      config[param] = value;
    }
    else{
      config[module][param] = value;
    }
  }
  this.config = config;
  
  this.WEBPACK_PLUGINS = [];
  
  this.__root = str=>{return "../"+str}
  this.__copy = params=>{
    this.WEBPACK_PLUGINS.push(new CopyWebpackPlugin([params]));
  }

  this.__imgOptimize = params=>{
    $.WEBPACK_PLUGINS.push(new CopyWebpackPlugin([{
        from: params.from,
        to: params.to,
        ignore: params.ignore || [],
      }
    ]));
  
    $.WEBPACK_PLUGINS.push(new ImageminPlugin({
      test: [params.to+'*.png',params.to+'**/*.png'],
      optipng: {
        optimizationLevel: 9
      },
    }));
    
    $.WEBPACK_PLUGINS.push(new ImageminPlugin({
      test: [params.to+'*.jpg',params.to+'**/*.jpg'],
      jpegtran: null,
      plugins: [
        imageminMozjpeg({
          quality: 75,
          progressive: true
        })
      ],
    }));
  }
    
  this.compileBase = (cb = ()=>{})=>{

    mix.babel(src.root+'social/fb/facebook-sdk-loader.js', dest.js + 'facebook-sdk-loader.min.js');
    mix.scripts(dep.bs+'js/bootstrap.min.js', dest.js+'bootstrap.min.js');
    mix.babel(dep.jquery+'jquery.min.js', dest.js+'jquery.min.js');
    mix.babel(dep.jquery+'jquery.slim.min.js', dest.js+'jquery.slim.min.js');

    mix.copy(dep.bs+'css/bootstrap.min.css',dest.css);

    if(!config.optimize)
      mix.copyDirectory(src.root+'images',dest.root+'images');
    else{
      $.__imgOptimize({
        from: src.root+'images',
        to: $.__root(dest.root+'images')
      });
    }
  
    mix.copy(dep.popperjs + 'umd/popper.min.js', dest.js+'popper.min.js');  //babel off

    mix.scripts([
      dep.pickadate + 'picker.js',
      dep.pickadate + 'picker.date.js',
      dep.pickadate + 'picker.time.js',
      dep.pickadate + 'legacy.js',
      dep.pickadate + 'translations/pt_BR.js',
      src.js + 'defaults/def-pickadate.js',
    ], dest.js + 'pickadate-full.min.js');//babel off
  
    mix.styles([
      dep.pickadate + 'compressed/themes/default.css',
      dep.pickadate + 'compressed/themes/default.date.css',
      dep.pickadate + 'compressed/themes/default.time.css',
      src.css + 'datapicker.css',
    ], dest.css + 'pickadate-full.min.css'); 
    
    //Corrigir posteriormente, fazer funcionar com babel
    //if(process.env.NODE_ENV !== 'production')
      // mix.scripts([
      //   dep.photoswipe + 'photoswipe.min.js',
      //   dep.photoswipe + 'photoswipe-ui-default.min.js',
      //   src.js + 'photoswipe-loader.js',
      // ], dest.vendors + 'photoswipe/photoswipe.min.js');
  
      $.WEBPACK_PLUGINS.push(new MergeIntoSingleFilePlugin({
        files:{
          'vendors/photoswipe/photoswipe.min.js': [
            dep.photoswipe + 'photoswipe.min.js',
            dep.photoswipe + 'photoswipe-ui-default.min.js',
            src.js + 'photoswipe-loader.js',
          ]
        },
      }));


    $.__imgOptimize({
      from: dep.photoswipe + 'default-skin',
      to: $.__root(dest.vendors + 'photoswipe'),
      ignore: ['*.css']
    });
    
  }//end compile base

  this.compileIO = (cb= ()=>{})=>{
    mix.copyDirectory(src.io.vendors+'glyphter-font/fonts/',dest.root+'fonts');

   if(config.io.sass){
    mix.less(dep.io.fuelux + 'less/fuelux.less', dest.io.vendors + 'fuelux/compiled_less/fuelux.css')
    .less(dep.io.fuelux + 'less/fuelux-core.less',dest.io.vendors + 'fuelux/compiled_less/fuelux-core.css')
    .less(dep.io.fuelux + 'less/wizard.less', dest.io.vendors + 'fuelux/compiled_less/wizard.css')
    .less(dep.io.fuelux + 'less/utility.less',dest.io.vendors + 'fuelux/compiled_less/utility.css')
    .less(dep.io.fuelux + 'less/pillbox.less',dest.io.vendors + 'fuelux/compiled_less/pillbox.css')
   }

      if(!config.io.optimize)
        mix.copyDirectory(src.io.root+'images', dest.io.root+'images');
      else{
        $.__imgOptimize({
          from: src.io.root+'images',
          to: $.__root(dest.io.root+'images'),
          ignore: [
            'source/**/*',
          ],
        });
      }

      /* IO base files for any service */
      mix.styles([
        dest.io.vendors + 'fuelux/compiled_less/fuelux.css',
        dest.io.vendors + 'fuelux/compiled_less/fuelux-core.css',
        dest.io.vendors + 'fuelux/compiled_less/wizard.css',
        dest.io.vendors + 'fuelux/compiled_less/pillbox.css',
        dest.io.vendors + 'fuelux/compiled_less/utility.css',
      ], dest.io.css + 'fuelux-compiled.min.css');

      mix.babel([
        dep.io.fuelux + 'js/wizard.js',
        dep.io.fuelux + 'js/dropdown-autoflip.js',
        dep.io.fuelux + 'js/utilities.js',
        dep.io.fuelux + 'js/pillbox.js',
      ], dest.io.js + 'fuelux-compiled.min.js');

      // Copy language files
      mix.copy(src.io.vendors +'datatables/datatables-pt-br.json',
        dest.io.vendors + 'datatables/lang/datatables-pt-br.json')
    //end io sass

    /*---------------------------------------------------------
      - Auth page files (this is not a service)
      for auth files are loaded separated for optimization
    ---------------------------------------------------------*/

    mix.styles([
      src.io.vendors + 'glyphter-font/css/intranetone.css',
      src.io.vendors + 'glyphter-font/css/custom-gi-intranetone.css',
      src.vendors + 'glyphter-font/glyphter-font.css',
      dep.sweetalert2 + 'sweetalert2.min.css',
      dep.animate + 'animate.min.css',
      dep.dv_holdonjs + 'css/HoldOn.min.css',
      dep.io.toastr + 'toastr.min.css',
      src.io.root + 'auth/auth.css',
    ], dest.io.css + 'io-mix-auth.min.css');

    mix.styles([
      src.vendors+'formvalidation-dist-v1.3.0/dist/css/formValidation.min.css',
      src.css + 'form-validation.css',
    ], dest.io.css + 'io-form-validation.min.css');

    $.WEBPACK_PLUGINS.push(new MergeIntoSingleFilePlugin({
      files:{
        'io/js/io-auth.min.js': [
          src.io.root + 'auth/auth.js',
          dep.dv_holdonjs + 'js/HoldOn.min.js',
        ]
      },
    }));

    mix.scripts([
      dep.sweetalert2 + 'sweetalert2.min.js',
      dep.io.toastr + 'toastr.min.js',
    ], dest.io.js + 'io-mix-auth.min.js');


    $.WEBPACK_PLUGINS.push(new MergeIntoSingleFilePlugin({
      files:{
        'io/js/io-form-validation.min.js': [
          dep.es6_shim+'es6-shim.min.js',
          src.vendors+'formvalidation-dist-v1.3.0/dist/js/FormValidation.full.min.js',
          src.vendors+'formvalidation-dist-v1.3.0/dist/js/plugins/Bootstrap.min.js',
        ]
      },
    }));

    $.WEBPACK_PLUGINS.push(new MergeIntoSingleFilePlugin({
      files:{
        'io/js/io-form-validation-pt_BR.js': [
          src.vendors+'formvalidation-dist-v1.3.0/dist/js/locales/pt_BR.js',
        ]
      },
    }));
    

    mix.styles([
      src.io.vendors + 'glyphter-font/css/intranetone.css',
      src.io.vendors + 'glyphter-font/css/custom-gi-intranetone.css',
      src.vendors + 'glyphter-font/glyphter-font.css',
      dep.dv_holdonjs + 'css/HoldOn.min.css',
      src.css + 'holdon.css',
      dep.io.toastr + 'toastr.min.css',
      src.io.root + 'auth/password-reset.css',
    ], dest.io.css + 'io-mix-password-reset.min.css');

    mix.babel([
      dep.dv_holdonjs + 'js/HoldOn.min.js',
      dep.io.toastr + 'toastr.min.js',
    ], dest.io.js + 'io-mix-password-reset.min.js');

    $.WEBPACK_PLUGINS.push(new MergeIntoSingleFilePlugin({
      files:{
        'io/js/io-password-reset.min.js': [
          src.io.root + 'auth/password-reset.js',
        ]
      },
    }));



    /** DASHBOARD */

    mix.styles([
      src.io.vendors + 'glyphter-font/css/intranetone.css',
      src.io.vendors + 'glyphter-font/css/custom-gi-intranetone.css',
      src.vendors + 'glyphter-font/glyphter-font.css',
      src.io.root + 'layout/dashboard.css',
      src.css + 'form-validation.css',
      dep.sweetalert2 + 'sweetalert2.min.css',
      dep.dv_holdonjs + 'css/HoldOn.min.css',
      src.css + 'holdon.css',
      dep.io.datatables.bs4 + 'css/dataTables.bootstrap4.css',
      src.io.vendors + 'datatables/datatables-default.css',
      src.io.vendors + 'datatables/datatables-pagination.css',
      src.io.root + 'custom/custom-wickedpicker.css',
      src.io.root + 'custom/custom-datatables.css',
     // src.io.root + 'custom/custom-form-validation.css',//TESTE
      src.io.root + 'custom/custom-dashboard.css',
      dep.io.elektron + 'dist/elektron.min.css',
      dep.io.onoffcanvas + 'onoffcanvas.min.css',
      src.io.root + 'layout/datatables.css',
      src.io.root + 'layout/fuelux.css',
      src.io.root + 'layout/elektron.css',
      src.io.root + 'layout/dash-menu.css',
      src.io.root + 'custom/intranetone-colors.css',
      src.css + 'helpers/dv-layout.css',
    ], dest.io.css + 'io-dashboard.min.css');


    mix.babel([
      dep.dv_holdonjs + 'js/HoldOn.min.js',
      dep.io.datatables.js + 'jquery.dataTables.js',
      src.io.js + 'defaults/def-datatables.js',
      src.io.js + 'extensions/ext-datatables.js',
      src.io.js + 'dashboard.js',
      src.io.js + 'IOService.js',
    ], dest.io.js + 'io-babel-dashboard.min.js');
    
    mix.scripts([
      src.js + 'dv-base-helper.js',
      dep.io.onoffcanvas + 'onoffcanvas.js',
      dep.sweetalert2 + 'sweetalert2.min.js',
      src.js + 'defaults/def-sweetalert2.js',
    ], dest.io.js + 'io-dashboard.min.js');
    
    //config.io.cb();
  }//end compile IO


  this.compile = (params={},cb)=>{
    $.compileBase();
    $.compileIO();

    if(params.services!==undefined)
      params.services.forEach((p)=>{
        p.compile($);
      })

    if(cb!==undefined)
      cb($);

    mix.webpackConfig({ plugins: $.WEBPACK_PLUGINS });
  }

  this.compileFE = ()=>{
    mix.copyDirectory($.src.fe.vendors+'glyphter-font/fonts/',$.dest.root+'fonts');
    if(!$.config.fe.optimize)
      mix.copyDirectory($.src.fe.root+'images', $.dest.fe.root+'images');
    else{
      __imgOptimize({
        from: $.src.fe.root+'images',
        to: $.__root($.dest.fe.root+'images'),
        ignore: [
          'source/**/*',
        ],
      });
    }
    //override base favicons
    mix.copyDirectory($.src.fe.root+'images/favicon', $.dest.root+'images/favicon');
    mix.copy($.src.fe.root+ 'images/favicon/favicon.ico', $.dest.root);    
  }
  
}



module.exports = new IntranetOne2();
