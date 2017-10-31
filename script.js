var editor = ace.edit("code");
editor.setTheme("ace/theme/monokai");
var tz1,
tbInstalled = false,
formatMoney = function(n, c, d, t){
  var c = isNaN(c = Math.abs(c)) ? 2 : c, 
  d = d == undefined ? "." : d, 
  t = t == undefined ? "," : t, 
  s = n < 0 ? "-" : "", 
  i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
  j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
},
onloadTbapi = function(){
  tbInstalled = true;//TODO
  window.tbapi.getActiveAccount().then(function(r){
    console.log(r);
    tz1 = r.tz1;
    $("#installTezbox").hide();
    $("#currentBalance").show();
    $("#currentAddress").show();
    $("#currentAddress").html( r.tz1);
    updateBalance();
  });
},
updateBalance = function(){
  window.eztz.rpc.getBalance(tz1).then(function(r){
    $("#currentBalance").html(formatMoney(r/100, 2, '.', ',') + 'ꜩ');
  });
},
index = [],
watch = eztz.contract.watch("TZ1aZJNUbW4yM7pzjSTM3dncgvXzsK39d1Z2", 5, function(s){
  s = eztz.utility.tzjson2arr(s);
  s = s[0][0];
  if (JSON.stringify(s) != JSON.stringify(index)){
    index = s;
    s.reverse();
    s = s.slice(0,8);
    var tb = "<table>";
    tb += "<thead><th></th><th>ID</th><th>Address</th><th>Bet Amount</th><th>Result</th></thead>";
    var spin = '', win = '';
    for(var i = 0; i < s.length; i++){
      if (s[i].value[3] == 'False'){
        win = '<i class=\"fa fa-close\"></i>';
      } else {
        win = '<i class=\"fa fa-check\"></i>';
      }
      if (s[i].value[2] == 'False'){
        win = '';
        spin = '<i class=\"fa fa-circle-o-notch fa-spin\"></i>';
      } else {
        spin = '';
      }
      
      tb += "<tr><td>"+spin+"</td><td>" + s[i].key + "</td><td>" + s[i].value[0]  + "</td><td>" + s[i].value[1]  + "ꜩ</td><td>" + win  + "</td></tr>";
    }
    tb += "</table>";
    $('#recentLuck').html(tb);
    if (tbInstalled)
      updateBalance();
  }
});
$('docmenut').ready(function(){
    if (typeof window.tbapi != "undefined"){
      onloadTbapi();
    } else {
      window.tbapiOnload = onloadTbapi;
    }
    $('button#getFreeTez').click(function(e){
      e.preventDefault();
      var amount = $('#amount').val();
      if (tbInstalled){
        window.tbapi.initiateTransaction({
          'address' : 'TZ1aZJNUbW4yM7pzjSTM3dncgvXzsK39d1Z2',
          'amount' : amount,
          'parameters' : 'Left Unit',
        });   
      } else {
        $('#manualTransaction').html("<strong>Please run the following:</strong><br />./tezos-client transfer "+amount+" from {ACCOUNT} to 'TZ1aZJNUbW4yM7pzjSTM3dncgvXzsK39d1Z2' -arg 'Left Unit'");
      }
    });
});
