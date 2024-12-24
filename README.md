# Tell Me When - Frontend Branch
## About
This project is built with React, specifically NextJS.<br><br>
Documentation and examples for NextJS can be found at the [NextJS website here.](https://nextjs.org/docs)
<br><br>
We will also be making use of TailwindCSS which allows for inline CSS styling, where the documentation and examples can be found [on their website here](https://tailwindcss.com/docs/installation) (This has already been installed and configured)

## Prerequisites/Things to install
To be able to work on this project, NodeJS will need to be installed.<br>
This can be found at their website [here.](https://nodejs.org/en)

## How to Start
To begin working on the project, open a terminal and follow the below steps.
<br><br>
To do this, nagivate to "tellmewhen" folder in the frontend branch using the command (must already be in the frontend branch):
```command
cd tellmewhen
```
After this, you can then run the following command in the terminal to start hosting the webpage:
```command
npm run dev
```
This then should host the webpage on your localhost, usually at "localhost:3000", although this will be clearly stated in the terminal which port it is being hosted on.

## Project Structure
### Pages/Routes
The different webpages can be found in the "src/app" folder, where each webpage is contained in a corresponding folder under the same name, and the content in a "page.jsx" file.<br><br>
To demonstrate this, to create an "about" page, the structure of the project would look like

```tree
src
├─ app
│  ├─ globals.css
│  ├─ page.jsx
│  ├─ layout.js
│  ├─ about
│  │  ├─ page.jsx
├─ components

```

The "page.jsx" file contains the content of the page for the about page, and will be located at 
```location
src/app/about/page.jsx
```
This will generate a webpage at the following location

```url
localhost:3000/about
```

**Note: The content for the main home page (landing page) is contained at**
```location
src/app/page.jsx
```
This also contains the global css file for the webpages, which also contains the setup files for TailwindCSS so be careful modifying this file
### UI Components
These are located in the "src/components" folder, and contain their own .jsx file for each component.

## TailwindCSS
This tool allows for us to add CSS inline with HTML elements.<br><br>
For example, to style a h1 element, you could use the following
```html
<h1 className = "text-[100px]">Tell Me When</h1>
```
which would make a h1 tag with the font size of 100px. It should be noted that this isn't mandatory to use, but ideally should be as it could cause issues down the road with conflicting styles.<br><br>
If the CSS isn't being properly applied, it could be an issue with the "tailwind.config.mjs" file where the directory of the file will need to be added for in the "contents=[...]" section, following the same structure as the rest. (** for folder, * for file, then followed by the allowed filetypes)
## Points Allocation