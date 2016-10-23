
$("[name='my-checkbox']").bootstrapSwitch();

var simulation = Simulation({drawing_element: '#wikipedia1'})
simulation.show()
setInterval(function(){
    simulation.add_client()
}, 100)

if($("[name='my-checkbox']").is(":checked")){
    simulation.toggle_p2p()
}

setTimeout(function(){
    console.log('timeout!', !simulation.are_peers_active())
    if(!simulation.are_peers_active()){
        console.log('toggling!')
        if(!$("[name='my-checkbox']").is(":checked")){
            $("[name='my-checkbox']").click()
        }
        // } else {
        //     $("[name='my-checkbox']").prop('checked', true); 
        // }
    }
}, 5000)

var is_chrome = true

$(".install-button").on("click", function(e){
  if(is_chrome){
    e.preventDefault();
    chrome.webstore.install("https://chrome.google.com/webstore/detail/dmnkcgdjldgfgbilknlgcbnemkkilfdk", function(){
      }, function(){
      document.location.href = "https://chrome.google.com/webstore/detail/dmnkcgdjldgfgbilknlgcbnemkkilfdk";
    });
  }
});


