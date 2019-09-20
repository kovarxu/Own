import {createGlobalStyle} from 'styled-components'

export default createGlobalStyle`
input, textarea {-webkit-appearance:none;appearance: none;border:none;outline:none;}
blockquote,body,button,dd,dl,dt,fieldset,form,h1,h2,h3,h4,h5,h6,hr,input,legend,li,ol,p,pre,td,textarea,th,ul{margin:0;padding:0;vertical-align:baseline}
img{border:none;vertical-align:top}
em,i{font-style:normal}
ol,ul{list-style:none}
button,h1,h2,h3,h4,h5,h6,input,select{font-size:100%;font-family:inherit}
table{border-collapse:collapse;border-spacing:0}
a{text-decoration:none;color:#333}
html{font-size:10px}
body{margin:0 auto;background:#FFF;font: 14px/1.5 "Helvetica Neue",Helvetica,"Microsoft Yahei",Arial,"Hiragino Sans GB","Heiti SC","WenQuanYi Micro Hei",sans-serif;line-height:1.4;color:#666;-webkit-text-size-adjust:100%!important;-webkit-user-select:none;user-select:none;background-color:#fff;line-height: 1.5}
input[type=text],input[type=tel],textarea{-webkit-appearance:none}
.h,.hide{display:none!important}
.show{display:block!important}
.box{margin-left: 1.2rem; margin-right: 1.2rem; padding: 0.6rem 0.8rem; border-radius: 0.4rem;}
.ellipsis{text-overflow:ellipsis;overflow:hidden;white-space:nowrap}
.word_warp{word-wrap: break-word;}
.clearfix:after,.clearfix:before{content:"";display:table}
.clearfix:after{clear:both}
.fr{float:right}
.fl{float:left}
.grid{display:-webkit-box;display:box}
.grid.middle{-webkit-box-pack:center;-webkit-box-align:center;box-pack:center;box-align:center}
.grid.vertical{-webkit-box-orient:vertical;box-orient:vertical}
.col-0{-webkit-box-flex:0;box-flex:0}
.col-1{-webkit-box-flex:1;box-flex:1}
.row{display: -webkit-box;display: -webkit-flex;display: flex;}
.column{display: -webkit-flex;display: flex;flex-direction:column; -webkit-flex-direction:column;}
.col{-webkit-box-flex: 1;-webkit-flex: 1;flex: 1;}
.row.items-center,.column.items-center{-webkit-align-items: center;align-items: center;}
.row.items-end,.column.items-end{-webkit-align-items: flex-end;align-items: flex-end;}
.row.items-stretch,.column.items-stretch{-webkit-align-items: stretch;align-items: stretch;}
.row.justify-center,.column.justify-center{-webkit-justify-content:center;justify-content: center}
.row.justify-end,.column.justify-end{-webkit-justify-content:flex-end;justify-content: flex-end}
.row.justify-between,.column.justify-between{-webkit-justify-content:space-between;justify-content: space-between}
.row.flex-wrap{flex-wrap:wrap; -webkit-flex-wrap:wrap;}
.row.content-center{-webkit-align-content:center;align-content:center;}
.row.content-end{-webkit-align-content:end;align-content:end;}
.self-center{-webkit-align-self:center;align-self:center;}
.row.middle{ -webkit-box-align: center;-webkit-align-items: center;align-items: center;-webkit-box-pack:center;-webkit-flex-pack:center; flex-pack:center;-webkit-justify-content:center;justify-content: center}
.row_right{display: -webkit-box;display: -webkit-flex;display: flex;-webkit-justify-content:flex-end;justify-content:flex-end;}
.mod_tips{position:fixed;top:40%;left:50%;width:30rem;z-index:3000;-webkit-transform:translate(-50%, -50%);transform:translate(-50%, -50%);text-align: center;}
	.mod_tips_txt{display:inline-block;text-align:center;background-color:rgba(0,0,0,0.8);-webkit-border-radius: 0.3rem;border-radius: 0.3rem;color:#fff;font-size: 1.3rem;padding: 1rem;line-height: 1.4}
@media only screen and (min-width:320px){html{font-size:8.533333333333333px}}
@media only screen and (min-width:360px){html{font-size:9.6px}}
@media only screen and (min-width:375px){html{font-size:10px}}
@media only screen and (min-width:384px){html{font-size:10.24px}}
@media only screen and (min-width:414px){html{font-size:11.04px}}
@media only screen and (min-width:480px){html{font-size:12.8px}}
@media only screen and (min-width:540px){html{font-size:14.4px}}
@media only screen and (min-width:640px){html{font-size:17.06666666666667px}}
@media only screen and (min-width:720px){html{font-size:19.2px}}
@media only screen and (min-width:750px){html{font-size:20px}}
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3){
  .iphonex_padding{padding-bottom: constant(safe-area-inset-bottom) !important;padding-bottom: env(safe-area-inset-bottom) !important;}
  .iphonex_margin{margin-bottom: constant(safe-area-inset-bottom);margin-bottom:env(safe-area-inset-bottom)}
  .iphonex_bottom{bottom:constant(safe-area-inset-bottom) !important;bottom: env(safe-area-inset-bottom) !important;;}
  .iphonex_white{background-color:white !important;}
}
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3){
  .iphonex_padding{padding-bottom: constant(safe-area-inset-bottom) !important;padding-bottom: env(safe-area-inset-bottom) !important;}
  .iphonex_margin{margin-bottom: constant(safe-area-inset-bottom);margin-bottom:env(safe-area-inset-bottom)}
  .iphonex_bottom{bottom:constant(safe-area-inset-bottom) !important;bottom: env(safe-area-inset-bottom) !important;;}
  .iphonex_white{background-color:white !important;}
}
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 2){
  .iphonex_padding{padding-bottom: constant(safe-area-inset-bottom) !important;padding-bottom: env(safe-area-inset-bottom) !important;}
  .iphonex_margin{margin-bottom: constant(safe-area-inset-bottom);margin-bottom:env(safe-area-inset-bottom)}
  .iphonex_bottom{bottom:constant(safe-area-inset-bottom) !important;bottom: env(safe-area-inset-bottom) !important;;}
  .iphonex_white{background-color:white !important;}
}
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2){
  .iphonex_padding{padding-bottom: constant(safe-area-inset-bottom) !important;padding-bottom: env(safe-area-inset-bottom) !important;}
  .iphonex_margin{margin-bottom: constant(safe-area-inset-bottom);margin-bottom:env(safe-area-inset-bottom)}
  .iphonex_bottom{bottom:constant(safe-area-inset-bottom) !important;bottom: env(safe-area-inset-bottom) !important;;}
  .iphonex_white{background-color:white !important;}
}
`
