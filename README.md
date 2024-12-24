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
The different webpages can be found in the "src" folder, where each webpage is contained in a corresponding folder under the same name, and the content in a "page.js" file.<br><br>
To demonstrate this, to create an "about" page, the structure of the project would look like

```tree
src
├─ about
│  ├─ page.js
├─ page.js
├─ layout.js
components

```

The "page.js" file contains the content of the page, where the content of the "about" page is contained at
```location
src/about/page.js
```
This will generate a webpage at the following location

```url
localhost:3000/about
```

**Note: The content for the main home page (landing page) is contained at**
```location
src/page.js
```

### UI Components
These are located in the "components" folder, and contain their own .jsx file for each component.

## Points Allocation