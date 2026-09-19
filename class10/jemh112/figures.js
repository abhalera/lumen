window.FIGURES=(function(){
  function t(x,y,s,o){o=o||{};return '<text x="'+x+'" y="'+y+'" font-size="'+(o.size||12)+'" fill="'+(o.color||"#1f2937")+'" text-anchor="middle">'+(s)+'</text>';}
  function wrap(w,h,b,l){return '<svg viewBox="0 0 '+w+' '+h+'" role="img" aria-label="'+l+'" xmlns="http://www.w3.org/2000/svg"><rect width="'+w+'" height="'+h+'" fill="#fff"/>'+b+'</svg>';}
  function ln(a,b,c,d,col,w){return '<line x1="'+a+'" y1="'+b+'" x2="'+c+'" y2="'+d+'" stroke="'+(col||'#111')+'" stroke-width="'+(w||1.6)+'"/>';}
  var figs={};
  figs["12.10"]={caption:"Fig. 12.10: capsule, 14 mm, diameter 5 mm.",svg:function(){
    var b='<path d="M70 80 A30 30 0 0 1 70 140 H170 A30 30 0 0 1 170 80 Z" fill="none" stroke="#111" stroke-width="1.6"/>';
    b+=t(120,70,"14 mm",{size:11})+t(120,160,"5 mm",{size:11});
    return wrap(240,180,b,"Fig. 12.10");
  }};
  figs["12.15"]={caption:"Fig. 12.15: gulab jamun, length 5 cm, diameter 2.8 cm.",svg:function(){
    var b='<path d="M80 70 A25 25 0 0 1 80 120 H160 A25 25 0 0 1 160 70 Z" fill="rgba(245,158,11,0.25)" stroke="#111" stroke-width="1.6"/>';
    return wrap(240,160,b,"Fig. 12.15");
  }};
  return figs;
})();
