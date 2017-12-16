# Wite

_Wite_ is a proof of concept customizeable modular interface, made to provide an environment where a selection of APIs can collectively display data in an aesthetically consistent interface, and provide users with a single location that acts as a hub for various media sites.

[Demo available here.](https://v-exec.github.io/Wite/)

The idea is to use the `window` container as a standalone application within the _Wite_ envrionment. To add a new application, in `scripts/windows.js`, simply add a case for each window type and handle it using a function that fetches whatever data the application needs. Typically, this would mean calling something from a javascript file and using custom css, which are found in `scripts/windows/`, and must be linked in `index.html`.

Currently, `create empty` and `create feed` are the only functional window types. The `feed` is an implementation of the [Rotonde JS Client](https://github.com/v-exec/Rotonde-JS-Client). I cannot guarantee the functionality of the `feed`.

### Controls

Windows can be resized by dragging the bottom right corner. Any other drags translate the window.

Any other functions are performed using the CLI at the bottom of the page.