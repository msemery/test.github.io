
document.rootElement.addEventListener('click', myFunction, false);

function myFunction(){
      list = document.getElementsByClassName('path_class');
      console.log(list);
      secundList = document.getElementById('path_V');
      console.log(secundList);
      thirdList = document.querySelectorAll('path');
      console.log(thirdList);
   };

document.rootElement.addEventListener('click', function(){
   paths = document.querySelectorAll('path');
   paths.forEach(function(path){
       path.setAttribute('fill', '#666666');
       path.setAttribute('class', 'anim2');
   })
});

