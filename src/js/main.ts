/**
 * Created by PurpleUma on 8/25/17.
 */
// const THREE = require("three");
// import THREE = require("three");
// import "./three.min.js"
// import * as THREE from 'three';
console.log(THREE);
// import "./GPUComputationRenderer.js"
import "./DragControls.js"
import "./TrackballControls.js"
import "./loaders/ColladaLoader.js";

// import "./loaders/ColladaLoader2.js";

import Vthree from "./vthree";
import Mapper from "./Mapper";
import Scene01 from "./Scene01";
import Scene02 from "./Scene02";

import GUI from "./GUI";


class Main
{

    public vthree:Vthree;
    public mapper:Mapper;
    public scene01:Scene01;
    public scene02:Scene02;
    public gui:GUI = new GUI();
    constructor()
    {

        // $.getJSON("json/guisetting.json" , (data) => {
            console.log("main start")
            this.vthree = new Vthree(1.0,false);
            // this.scene01 = new Scene01(this.vthree.renderer,this.gui, this.vthree);
            this.scene02 = new Scene02(this.vthree.renderer,this.gui, this.vthree);
            this.mapper = new Mapper(this.scene02);


        this.vthree.addScene(this.scene02);
            // this.vthree.addScene(this.scene01);

        // }

        // this.vthree.draw();
    }
}


window.onload = function() {


    const main = new Main();
}