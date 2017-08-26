/**
 * Created by PurpleUma on 8/25/17.
 */
// import THREE = require("three");

import "../../node_modules/three/examples/js/controls/DragControls.js"
import "../../node_modules/three/examples/js/controls/TrackballControls.js"
import "./loaders/ColladaLoader.js";
// import "./loaders/ColladaLoader2.js";

// import "../../node_modules/three/build/three.min.js";
import Vthree from "./vthree";
import Mapper from "./Mapper";
import Scene01 from "./Scene01";

import GUI from "./GUI";

class Main
{

    public vthree:Vthree;
    public mapper:Mapper;
    public scene01:Scene01;
    public gui:GUI = new GUI();
    constructor()
    {

        // $.getJSON("json/guisetting.json" , (data) => {
            console.log("main start")
            this.vthree = new Vthree(1.0,false);
            this.scene01 = new Scene01(this.vthree.renderer,this.gui, this.vthree);
            this.mapper = new Mapper(this.scene01);

            this.vthree.addScene(this.scene01);
        // }

        // this.vthree.draw();
    }
}


window.onload = function() {


    const main = new Main();
}