/*! 2014 Baidu Inc. All Rights Reserved */
define("weekly/drawer",function(){function a(a,t,r,e,o,i){var n=e||12,s=i||"#fff",f=o||15,h=Math.min(t,r)||35,l=Math.max(t,r)||60,p=l+f,u=l+f,c=Raphael(a,2*l+2*f,2*l+2*f),x=[],v=[],m=2*Math.PI/n,y={stroke:s,"stroke-width":f,"stroke-linecap":"round"};Raphael.getColor.reset();for(var M=0;n>M;M++){var d=m*M-Math.PI/2,k=Math.cos(d),w=Math.sin(d);if(v[M]=1/n*M,x[M]=c.path([["M",p+h*k,u+h*w],["L",p+l*k,u+l*w]]).attr(y),"rainbow"==s)x[M].attr("stroke",Raphael.getColor())}var b;return function R(){v.unshift(v.pop());for(var a=0;n>a;a++)x[a].attr("opacity",v[a]);c.safari(),b=setTimeout(R,1e3/n)}(),function(){clearTimeout(b),c.remove()}}function t(){if(e)e.clear()}function r(a,t){var r=e=Raphael(a),o=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],i=function(){for(var a=[],t=7;t>0;t--)for(var r=0;24>r;r++)a.push(t);return a}(),n=["日","六","五","四","三","二","一"],s=["12am","1","2","3","4","5","6","7","8","9","10","11","12pm","1","2","3","4","5","6","7","8","9","10","11"];return r.dotchart(5,5,320,180,o,i,t,{symbol:"o",max:6,heat:!0,axis:"0 0 0 0",axisxstep:23,axisystep:6,axisxlabels:s,axisxtype:" ",axisytype:" ",axisylabels:n}),r}var e,exports={spinner:a,draw:r,clear:t};return exports});