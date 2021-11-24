//Global data variables to define sizes
const defSize = 16;
const defButton = 'color';

let newSize = defSize;
let newColor = 'black';
let newButton = defButton;

//Identifies the color picker in the list of buttons and adds an event
//listener to identify what the user chooses. Default value is black.
const colorPick = document.getElementById('colorPicker');
colorPick.addEventListener('input', colorTiles);
colorPick.value = '#000000';

//Locates and populates the initial grid for the pixels.
const contain = document.querySelector('#container');
contain.style.gridTemplateColumns = `repeat(${defSize}, 1fr)`;
contain.style.gridTemplateRows = `repeat(${defSize}, 1fr)`;

//Grid starts as 16 * 16
for (let i = 1; i <= 256; ++i)
{
    var square = document.createElement('div');
    square.classList.add('square');
    square.setAttribute('id', 'square');
    contain.appendChild(square);
}

//Locates created pixel squares and gives each an event listener
let boxes = document.querySelectorAll('#square');
boxes.forEach((div) => {
    div.addEventListener('mouseover', changeColor);
});

//This function triggers on mouseover from the square's event listener,
//and will set the background color of the square to newColor, which can be
//defined by the user by clicking one of the buttons.
function changeColor(e)
{
    if (newButton == 'rainbow')
    {
        newColor = rainbowColors();
    }

    e.target.style.backgroundColor = newColor;
    e.target.style.opacity = 1;

    console.log(newColor)
}

//Links to color button, sets to user chosen color
const color = document.getElementById('color');
color.addEventListener('click', colorTiles);
color.classList.add('active');

//Links to rainbow button, will set to color of random RGB value
const rainbow = document.getElementById('rainbow');
rainbow.addEventListener('click', rainbowColors);

//Links to gradient button, will increase opacity of button by 10% with
//each mouseover in the grid
const gradient = document.getElementById('gradient');
gradient.addEventListener('click', gradientShift);

//Links to eraser button, will "erase" the current square by setting it back to white
const eraser = document.getElementById('eraser');
eraser.addEventListener('click', erase);

//Links to clear button, will "clear" the board by making all pixels white
const clear = document.getElementById('clear');
clear.addEventListener('click', clearSketch);

//Links to Adjust Size button, will prompt user for a new dimension of the grid
const resize = document.getElementById('resize');
resize.addEventListener('click', setBoardSize);


//Allows the user to select a color manually and will then update that color as the newColor
function colorTiles(e)
{
    buttonChange('color');
    newColor = colorPick.value;
}


//Creates a random color by randomizing the rgb values of said color, then updates as newColor
function rainbowColors()
{
    buttonChange('rainbow');

    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);

    //Returns as a string. The RGB value will have an opacity of 100%
    return 'rgba(' + r + ',' + g + ',' + b + ', 1)';
}



//Gets the current gradient color of the pixel, and will increase its opacity
//by 10% if it is not already 100%
function gradientShift(e)
{
    buttonChange('gradient');

    boxes.forEach((square) => {
        square.addEventListener('mouseover', gradientPlus)});
}


//Sets newColor to white, which will appear as though the user is erasing the colored tiles
function erase()
{
    buttonChange('eraser');
    newColor = 'white';
}


//Clears the board of any colored pixels by setting all pixels to white. Links to the Clear Sketch button.
function clearSketch()
{
    let prevButton = newButton;

    buttonChange('clear');

    if (confirm("Are you sure you want to clear the sketch?")) 
    {
        const boxes = document.querySelectorAll('#square');

        boxes.forEach((div) => {
            div.style.backgroundColor = 'white';
        });

        buttonChange('color');
        colorPick.value = '#000000';
    } 
    
    else 
    {
        buttonChange(prevButton);

        return;
    }
}


//Allows the user to resize the board when the "Adjust Size" button
//is clicked. It prompts the user for the new size, clears the current
//board, then refills it with blank tiles.
function setBoardSize()
{
    buttonChange('resize');

    //Removes the event listeners from the divs that are about to be cleared
    boxes.forEach((square) => {
        square.removeEventListener('mouseover', changeColor);
    });

    //Validates user input on the size of the new grid
    while(true)
    {
        newSize = prompt("Please enter a height/width between 16 and 100.")

        if (newSize < 16 || newSize > 100)
        {
            alert("The height/width must be between 16 and 100.")
            continue;
        }

        else
        {
            break;
        }
    }

    //Clears the current board
    contain.innerHTML = '';

    //Resizes the rows and columns
    contain.style.gridTemplateColumns = `repeat(${newSize}, 1fr)`;
    contain.style.gridTemplateRows = `repeat(${newSize}, 1fr)`;

    //Fills in the new board with divs
    for (let i = 1; i <= newSize * newSize; ++i)
    {
        var square = document.createElement('div');
        square.classList.add('square');
        square.setAttribute('id', 'square');
        contain.appendChild(square);
    }

    //Readjusts the boxes variable to recognize the new divs within container.
    boxes = document.querySelectorAll('#square');
    boxes.forEach((div) => {
        div.addEventListener('mouseover', changeColor);
    });

    //resets the button to color and the color to black
    buttonChange('color');
    colorPick.value = '#000000';
}


//Determines the current opacity of the square's color, and raises it by
//10% unless it is at 100%. Then adds a seperate color option to not
//conflict with the solid color changer function (changeColor).
function gradientPlus(e)
{
    if (e.target.style.backgroundColor == "" || e.target.style.backgroundColor == "white")
    {
        e.target.style.opacity = .1;
        e.target.style.backgroundColor = 'black';
    }

    else if (e.target.style.opacity < 1)
    {
        e.target.style.opacity = parseFloat(e.target.style.opacity) + 0.1;
    }

    else
    {
        return;
    }
}


//Simple function to keep track of active event listeners between the buttons.
//Will deactivate the event listeners of other buttons when a button is clicked.
function buttonChange(buttonName)
{
    //Color is the default button and will be activated by 
    //event listeners when divs are created or the color button is pressed.
    //Deactivates the gradientPlus event listeners in order to color the
    //pixels solid colors.
    if (buttonName == 'color')
    {
        if (newButton == 'color')
        {
            newColor = colorPick.value;
            return;
        }

        //Toggle active class to make the button appear active
        color.classList.toggle('active');
        gradient.classList.remove('active');                                   
        eraser.classList.remove('active'); 
        rainbow.classList.remove('active'); 
        resize.classList.remove('active'); 
        clear.classList.remove('active'); 

        newButton = 'color';
        newColor = colorPick.value;
        console.log(colorPick.value + newColor)
        boxes.forEach((square) => {
            square.addEventListener('mouseover', changeColor);
            square.removeEventListener('mouseover', gradientPlus)});
    }

    //Updates newButton to rainbow so random colors can be chosen in the 
    //changeColor function.
    else if (buttonName == 'rainbow')
    {
        if (newButton == 'rainbow')
        {
            return;
        }

        //Toggle active class to make the button appear active
        rainbow.classList.toggle('active');
        gradient.classList.remove('active');                                   
        eraser.classList.remove('active'); 
        color.classList.remove('active'); 
        resize.classList.remove('active'); 
        clear.classList.remove('active');

        newButton = 'rainbow';
        boxes.forEach((square) => {
            square.addEventListener('mouseover', changeColor);
            square.removeEventListener('mouseover', gradientPlus)});
    }

    //Deactivates the event listeners for generic color change and activates the listener
    //for the gradient style of coloring.
    else if (buttonName == 'gradient')
    {
        //Toggle active class to make the button appear active
        gradient.classList.toggle('active');
        color.classList.remove('active');                                   
        eraser.classList.remove('active'); 
        rainbow.classList.remove('active'); 
        resize.classList.remove('active'); 
        clear.classList.remove('active');

        newButton = 'gradient';
        boxes.forEach((square) => {
            square.removeEventListener('mouseover', changeColor);
        });
    }

    //Updates newButton to eraser and fixes the gradient and color
    //event listeners to avoid conflicts with coloring functions
    else if (buttonName == 'eraser')
    {
        //Toggle active class to make the button appear active
        eraser.classList.toggle('active');
        gradient.classList.remove('active');                                   
        color.classList.remove('active'); 
        rainbow.classList.remove('active'); 
        resize.classList.remove('active'); 
        clear.classList.remove('active');

        newButton = 'eraser';
        boxes.forEach((square) => {
            square.addEventListener('mouseover', changeColor);
            square.removeEventListener('mouseover', gradientPlus);
        });
    }

    //Toggles Adjust Size button and deactivates the others. The
    //color button will be reactivated shortly after.
    else if (buttonName == 'resize')
    {
        newButton = 'resize';
        newColor = 'black';

        //Toggle active class to make the button appear active
        resize.classList.toggle('active');
        gradient.classList.remove('active');                                   
        eraser.classList.remove('active'); 
        rainbow.classList.remove('active'); 
        color.classList.remove('active'); 
        clear.classList.remove('active');
    }

    //Toggles the clear button and deactivates the others. The color
    //button will be reactivated shortly after.
    else if (buttonName == 'clear')
    {
        newButton = 'clear';
        newColor = 'black';

        //Toggle active class to make the button appear active
        clear.classList.toggle('active');
        gradient.classList.remove('active');                                   
        eraser.classList.remove('active'); 
        rainbow.classList.remove('active'); 
        resize.classList.remove('active'); 
        color.classList.remove('active');
    }
}