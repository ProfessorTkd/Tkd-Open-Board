let toolsContainer = document.querySelector(".tools-container");
let optionsContainer = document.querySelector(".options-container");
let optionsFlag = true;
let pencilToolContainer = document.querySelector(".pencil-tool-container");
let eraserToolContainer = document.querySelector(".eraser-tool-container");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let pencilFlag = false;
let eraserFlag = false;
let sticky = document.querySelector(".sticky");
let upload = document.querySelector(".upload");


optionsContainer.addEventListener("click", (e) => {
   // true -> show tools, false -> hide tools
    optionsFlag = !optionsFlag;

    if (optionsFlag) openTools();
    else closeTools();
})

function openTools() {
    let iconElement = optionsContainer.children[0];
    iconElement.classList.remove("fa-times");
    iconElement.classList.add("fa-bars");
    toolsContainer.style.display = "flex";
}

function closeTools() {
    let iconElement = optionsContainer.children[0];
    iconElement.classList.remove("fa-bars");
    iconElement.classList.add("fa-times");
    toolsContainer.style.display = "none";
    pencilToolContainer.style.display = "none";
    eraserToolContainer.style.display = "none";
}

pencil.addEventListener("click", (e) => {
    // true -> show pencil tools, false -> hide pencil tools
    pencilFlag = !pencilFlag;

    if (pencilFlag) pencilToolContainer.style.display = "block";
    else pencilToolContainer.style.display = "none";
})

eraser.addEventListener("click", (e) => {
    // true -> show eraser tool, false -> hide eraser tool
    eraserFlag = !eraserFlag;

    if (eraserFlag) eraserToolContainer.style.display = "block";
    else eraserToolContainer.style.display = "none";
})

upload.addEventListener("click", (e) =>{
  //Open file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e) =>{
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let stickykaTemplateHTML = `
          <div class="header-container">
          <div class="minimize"></div>
          <div class="remove"></div>
          </div>
          <div class="notes-container">
          <img src="${url}"></img>  
          </div>` ;

          createSticky(stickykaTemplateHTML);
      })
})

sticky.addEventListener("click", (e) => {
    let stickykaTemplateHTML =`
    <div class="header-container">
             <div class="minimize"></div>
             <div class="remove"></div>
    </div>
    <div class="notes-container">
            <textarea spellcheck="false"></textarea>
    </div>`;

    createSticky(stickykaTemplateHTML);

})


function createSticky(stickykaTemplateHTML) {
  let stickykaContainer = document.createElement("div");
  stickykaContainer.setAttribute("class", "sticky-container");
  stickykaContainer.innerHTML = stickykaTemplateHTML;

  document.body.appendChild(stickykaContainer);

  let minimize = stickykaContainer.querySelector('.minimize');
  let remove = stickykaContainer.querySelector('.remove');
  noteActions(minimize, remove, stickykaContainer);

    stickykaContainer.onmousedown = function(event) {
      dragAndDrop(stickykaContainer, event);
    };
    stickykaContainer.ondragstart = function() {
      return false;
    };
  }


function noteActions(minimize, remove, stickykaContainer) {
    remove.addEventListener("click", (e) => {
        stickykaContainer.remove(); 
    })
    minimize.addEventListener("click", (e) => {
        let noteKaContainer = stickykaContainer.querySelector(".notes-container");
        let display = getComputedStyle(noteKaContainer).getPropertyValue("display");
        if (display === "none") noteKaContainer.style.display = "block";
         else noteKaContainer.style.display = "none";
    })
}


function dragAndDrop(element, event) {
         let shiftX = event.clientX - element.getBoundingClientRect().left;
        let shiftY = event.clientY - element.getBoundingClientRect().top;
      
        element.style.position = 'absolute';
        element.style.zIndex = 1000;
        // document.body.append(ball);
      
        moveAt(event.pageX, event.pageY);
      
        // moves the element at (pageX, pageY) coordinates
        // taking initial shifts into account
        function moveAt(pageX, pageY) {
            element.style.left = pageX - shiftX + 'px';
            element.style.top = pageY - shiftY + 'px';
        }
      
        function onMouseMove(event) {
          moveAt(event.pageX, event.pageY);
        }
      
        // move the element on mousemove
        document.addEventListener('mousemove', onMouseMove);
      
        // drop the element, remove unneeded handlers
        element.onmouseup = function() {
          document.removeEventListener('mousemove', onMouseMove);
          element.onmouseup = null;
      };
    }
