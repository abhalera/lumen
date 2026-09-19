// Exact set regions: SVG masks use the same circle boundaries as the outlines.
window.setRegions = function(mode, id, dark){
  var bg=dark?'#09131d':'#fff', ink=dark?'#e2e8f0':'#152637', fill=dark?'#34d399':'#91d9cc';
  var a='<circle cx="130" cy="100" r="62"', b='<circle cx="210" cy="100" r="62"';
  var start='<rect x="12" y="15" width="316" height="170"';
  var mask='<defs><mask id="'+id+'"><rect width="340" height="200" fill="black"/>';
  if(mode==='union') mask+=a+' fill="white"/>'+b+' fill="white"/>';
  if(mode==='inter') mask+='<clipPath id="'+id+'-clip">'+a+'/></clipPath><g clip-path="url(#'+id+'-clip)">'+b+' fill="white"/></g>';
  if(mode==='diff') mask+=a+' fill="white"/>'+b+' fill="black"/>';
  if(mode==='outside') mask+=start+' fill="white"/>'+a+' fill="black"/>'+b+' fill="black"/>';
  if(mode==='notinter') mask+=start+' fill="white"/><clipPath id="'+id+'-clip">'+a+'/></clipPath><g clip-path="url(#'+id+'-clip)">'+b+' fill="black"/></g>';
  mask+='</mask></defs>';
  return mask+start+' fill="'+bg+'" stroke="'+ink+'"/>'+start+' fill="'+fill+'" mask="url(#'+id+')"/>'+a+' fill="none" stroke="'+ink+'" stroke-width="2"/>'+b+' fill="none" stroke="'+ink+'" stroke-width="2"/><g fill="'+ink+'" font-size="15"><text x="22" y="37">U</text><text x="100" y="75">A</text><text x="230" y="75">B</text></g>';
};
window.FIGURES=window.FIGURES||{};
window.FIGURES['exercise-1.5.5']={
 caption:'Exercise 1.5 Q5 · PDF p.20. Green is the required set. Each row displays equal regions by De Morgan’s laws.',
 svg:function(){
  var labels=['(i) (A ∪ B)′','(ii) A′ ∩ B′','(iii) (A ∩ B)′','(iv) A′ ∪ B′'];
  var s='<svg viewBox="0 0 700 470" role="img" aria-label="Four Venn diagrams showing both De Morgan identities" style="width:100%;height:auto">';
  labels.forEach(function(label,i){s+='<g transform="translate('+(i%2*350)+','+(Math.floor(i/2)*235)+')"><text x="170" y="20" text-anchor="middle" fill="#152637" font-size="18">'+label+'</text><g transform="translate(0,30)">'+window.setRegions(i<2?'outside':'notinter','ex155-'+i,false)+'</g></g>';});
  return s+'</svg>';
 }};
